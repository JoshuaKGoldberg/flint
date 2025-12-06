import type { CachedFactory } from "cached-factory";

import { debugForFile } from "debug-for-file";

import type { Rule, RuleAbout, RuleRuntime } from "../types/rules.js";

import { DirectivesFilterer } from "../directives/DirectivesFilterer.js";
import {
	type Language,
	LanguageFileDiagnostic,
	type LanguageFileFactory,
} from "../types/languages.js";
import { FileReport } from "../types/reports.js";

const log = debugForFile(import.meta.filename);

export async function lintFile<
	About extends RuleAbout,
	AstNodesByName,
	ContextServices extends object,
	FileContext extends object | undefined,
	MessageId extends string,
>(
	filePathAbsolute: string,
	rule: Omit<
		Rule<About, AstNodesByName, ContextServices, FileContext, string, never>,
		"setup"
	>,
	runtime: RuleRuntime<AstNodesByName, MessageId, ContextServices, FileContext>,
	skipDiagnostics: boolean,
	languageFactories: CachedFactory<
		Language<AstNodesByName, ContextServices>,
		LanguageFileFactory<AstNodesByName, ContextServices>
	>,
): Promise<{
	dependencies: Set<string>;
	diagnostics: LanguageFileDiagnostic[];
	reports: FileReport[];
}> {
	const dependencies = new Set<string>();
	const diagnostics: LanguageFileDiagnostic[] = [];
	const reports: FileReport[] = [];

	const language = languageFactories
		// TODO: How to make types more permissive around assignability?
		// See AnyRule's any
		.get(rule.language);

	const { file } = language.prepareFromDisk.get(filePathAbsolute);

	if (file.cache?.dependencies) {
		for (const dependency of file.cache.dependencies) {
			if (!dependencies.has(dependency)) {
				log("Adding file dependency %s:", dependency);
				dependencies.add(dependency);
			}
		}
	}

	// TODO: These should probably be put in some kind of queue?
	const ruleReports = await file.runRule(runtime, rule.messages);
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

	const directivesFilterer = new DirectivesFilterer();

	const languageFiles = language.prepareFromDisk;

	for (const [, prepared] of languageFiles.entries()) {
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
					rule.language.about.name,
					filePathAbsolute,
				);
				diagnostics.push(...prepared.file.getDiagnostics());
				log(
					"Retrieved language %s diagnostics for file %s",
					rule.language.about.name,
					filePathAbsolute,
				);
			}
		}

		if (prepared.reports) {
			log(
				"Found %d comment reports for language %s in file %s",
				reports.length,
				rule.language.about.name,
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

	for (const [, { file }] of languageFiles.entries()) {
		log(
			"Disposing language %s for file %s",
			rule.language.about.name,
			filePathAbsolute,
		);
		file[Symbol.dispose]();
		log(
			"Disposed language %s for file %s",
			rule.language.about.name,
			filePathAbsolute,
		);
	}

	return { dependencies, diagnostics, reports: filteredReports };
}
