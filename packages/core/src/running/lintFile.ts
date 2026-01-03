import { makeAbsolute } from "@flint.fyi/utils";
import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";

import { DirectivesFilterer } from "../directives/DirectivesFilterer.js";
import {
	AnyLanguage,
	LanguageFileDiagnostic,
	LanguageFileFactory,
} from "../types/languages.js";
import { FileReport } from "../types/reports.js";
import { computeRulesWithOptions } from "./computeRulesWithOptions.js";
import { ConfigUseDefinitionWithFiles } from "./computeUseDefinitions.js";

const log = debugForFile(import.meta.filename);

export async function lintFile(
	filePath: string,
	languageFactories: CachedFactory<AnyLanguage, LanguageFileFactory>,
	skipDiagnostics: boolean,
	useDefinitions: ConfigUseDefinitionWithFiles[],
) {
	const filePathAbsolute = makeAbsolute(filePath);
	log("Linting: %s:", filePathAbsolute);

	const dependencies = new Set<string>();
	const diagnostics: LanguageFileDiagnostic[] = [];
	const reports: FileReport[] = [];

	const languageFiles = new CachedFactory((language: AnyLanguage) =>
		languageFactories.get(language).prepareFile(filePathAbsolute),
	);
	const rulesWithOptions = computeRulesWithOptions(filePath, useDefinitions);

	// TODO: It would probably be good to group rules by language...
	for (const [rule, options] of rulesWithOptions) {
		// TODO: How to make types more permissive around assignability?
		// See AnyRule's any
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const { file } = languageFiles.get(rule.language);

		if (file.cache?.dependencies) {
			for (const dependency of file.cache.dependencies) {
				if (!dependencies.has(dependency)) {
					log("Adding file dependency %s:", dependency);
					dependencies.add(dependency);
				}
			}
		}

		// TODO: These should probably be put in some kind of queue?
		log("Running rule %s with options: %o", rule.about.id, options);
		const ruleReports = await file.runRule(rule, options as object | undefined);
		log("Found %d reports from rule %s", ruleReports.length, rule.about.id);

		for (const ruleReport of ruleReports) {
			reports.push({
				about: rule.about,
				...ruleReport,
			});

			if (ruleReport.dependencies) {
				for (const dependency of ruleReport.dependencies) {
					dependencies.add(dependency);
				}
			}
		}
	}

	const directivesFilterer = new DirectivesFilterer();

	for (const [language, prepared] of languageFiles.entries()) {
		if (prepared.directives) {
			log(
				"Adding %d directives for file %s",
				prepared.directives,
				filePathAbsolute,
			);
			directivesFilterer.add(prepared.directives);
		}

		if (!skipDiagnostics) {
			if (prepared.file.getDiagnostics) {
				log(
					"Retrieving language %s diagnostics for file %s",
					language.about.name,
					filePathAbsolute,
				);
				diagnostics.push(...prepared.file.getDiagnostics());
				log(
					"Retrieved language %s diagnostics for file %s",
					language.about.name,
					filePathAbsolute,
				);
			}
		}

		if (prepared.reports) {
			log(
				"Found %d comment reports for language %s in file %s",
				reports.length,
				language.about.name,
				filePathAbsolute,
			);
			reports.push(...prepared.reports);
		}
	}

	log("Found %d total reports for %s", reports.length, filePathAbsolute);

	const filteredReports = directivesFilterer.filter(reports);

	log(
		"Filtered to %d reports for %s",
		filteredReports.length,
		filePathAbsolute,
	);

	for (const [language, { file }] of languageFiles.entries()) {
		log(
			"Disposing language %s for file %s",
			language.about.name,
			filePathAbsolute,
		);
		file[Symbol.dispose]();
		log(
			"Disposed language %s for file %s",
			language.about.name,
			filePathAbsolute,
		);
	}

	return { dependencies, diagnostics, reports: filteredReports };
}
