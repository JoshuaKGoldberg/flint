import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";

import { ConfigRuleDefinition } from "../types/configs.js";
import {
	AnyLanguage,
	LanguageFileDiagnostic,
	LanguageFileFactory,
} from "../types/languages.js";
import { FileRuleReport } from "../types/reports.js";
import { computeRulesWithOptions } from "./computeRulesWithOptions.js";

const log = debugForFile(import.meta.filename);

export async function lintFile(
	filePathAbsolute: string,
	languageFactories: CachedFactory<AnyLanguage, LanguageFileFactory>,
	ruleDefinitions: ConfigRuleDefinition[],
	skipDiagnostics: boolean,
) {
	log("Linting: %s:", filePathAbsolute);

	const dependencies = new Set<string>();
	const diagnostics: LanguageFileDiagnostic[] = [];
	const reports: FileRuleReport[] = [];

	const languageFiles = new CachedFactory((language: AnyLanguage) =>
		languageFactories.get(language).prepareFileOnDisk(filePathAbsolute),
	);
	const rulesWithOptions = computeRulesWithOptions(ruleDefinitions);

	// TODO: It would probably be good to group rules by language...
	for (const [rule, options] of rulesWithOptions) {
		// TODO: How to make types more permissive around assignability?
		// See AnyRule's any
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const file = languageFiles.get(rule.language);

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

	if (!skipDiagnostics) {
		for (const [language, file] of languageFiles.entries()) {
			if (file.getDiagnostics) {
				log(
					"Retrieving language %s diagnostics for file file %s",
					language.about.name,
					filePathAbsolute,
				);
				diagnostics.push(...file.getDiagnostics());
				log(
					"Retrieved language %s diagnostics for file file %s",
					language.about.name,
					filePathAbsolute,
				);
			}
		}
	}

	for (const [language, file] of languageFiles.entries()) {
		log("Disposing language %s file %s", language.about.name, filePathAbsolute);
		file[Symbol.dispose]();
		log("Disposed language %s file %s", language.about.name, filePathAbsolute);
	}

	log("Found %d reports for %s", reports.length, filePathAbsolute);

	return { dependencies, diagnostics, reports };
}
