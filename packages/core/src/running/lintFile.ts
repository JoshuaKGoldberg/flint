import { makeAbsolute } from "@flint.fyi/utils";
import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";

import { DirectivesFilterer } from "../directives/DirectivesFilterer.js";
import {
	AnyLanguage,
	LanguageFileDefinition,
	LanguageFileDiagnostic,
	LanguageFileFactory,
} from "../types/languages.js";
import { FileReport } from "../types/reports.js";
import { AnyRule, AnyRuleRuntime } from "../types/rules.js";
import { computeRulesWithOptions } from "./computeRulesWithOptions.js";
import { ConfigUseDefinitionWithFiles } from "./computeUseDefinitions.js";

const log = debugForFile(import.meta.filename);

export interface LintFileResults {
	dependencies: Set<string>;
	diagnostics: LanguageFileDiagnostic[];
	reports: FileReport[];
}

/**
 * Value references that change across uses of a singleton rule runtime.
 */
export interface RuntimeStorage {
	/**
	 * Language file representation of the source code file being linted.
	 */
	file: LanguageFileDefinition;

	/**
	 * Where to store reports created by the currently running rule.
	 * These might not be the final reports returned by {@link lintFile},
	 * as those still need to be filtered based on comment directives.
	 */
	reports: FileReport[];
}

export async function lintFile(
	filePath: string,
	languageFileFactoryFactory: CachedFactory<AnyLanguage, LanguageFileFactory>,
	ruleRuntimeFactory: CachedFactory<AnyRule, Promise<AnyRuleRuntime>>,
	runtimeStorage: RuntimeStorage,
	useDefinitions: ConfigUseDefinitionWithFiles[],
	skipDiagnostics: boolean,
) {
	const filePathAbsolute = makeAbsolute(filePath);
	const results: LintFileResults = {
		dependencies: new Set(),
		diagnostics: [],
		reports: [],
	};

	runtimeStorage.reports = results.reports;

	const languageFileFactory = new CachedFactory((language: AnyLanguage) => {
		log("Creating language file factory %s:", language.about.name);

		const fileFactory = languageFileFactoryFactory
			.get(language)
			.prepareFromDisk(filePathAbsolute);

		if (fileFactory.file.cache?.dependencies) {
			for (const dependency of fileFactory.file.cache.dependencies) {
				if (!results.dependencies.has(dependency)) {
					log("Adding file dependency %s:", dependency);
					results.dependencies.add(dependency);
				}
			}
		}

		return fileFactory;
	});

	const rulesWithOptions = computeRulesWithOptions(filePath, useDefinitions);

	// First we set up all the rule runtimes in parallel (each is asynchronous)
	const ruleOptionsAndRuntimes = new Map(
		await Promise.all(
			rulesWithOptions.entries().map(
				async ([rule, options]) =>
					[
						rule,
						{
							options,
							runtime: await ruleRuntimeFactory.get(rule),
						},
					] as const,
			),
		),
	);

	// Then, we run each rule's runtime on the file (visitors are synchronous)
	for (const [rule, { options, runtime }] of ruleOptionsAndRuntimes) {
		// TODO: How to make types more permissive around assignability?
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const fileFactory = languageFileFactory.get(rule.language);
		runtimeStorage.file = fileFactory.file;

		log("Running rule %s with options: %o", rule.about.id, options);

		// TODO: How to make types more permissive around assignability?
		// See AnyRuleRuntime's any
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		fileFactory.file.runVisitors(runtime, options as object | undefined);
	}

	// TODO: These directives filters need to apply after rule teardown()s.
	// But, teardown()s apply outside of lintFile, more in lintOnce...

	const directivesFilterer = new DirectivesFilterer();

	for (const [language, prepared] of languageFileFactory.entries()) {
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
				results.diagnostics.push(...prepared.file.getDiagnostics());
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
				prepared.reports.length,
				language.about.name,
				filePathAbsolute,
			);
			results.reports.push(...prepared.reports);
		}
	}

	log(
		"Found %d total reports for %s",
		results.reports.length,
		filePathAbsolute,
	);

	const filteredReports = directivesFilterer.filter(results.reports);

	log(
		"Filtered to %d reports for %s",
		filteredReports.length,
		filePathAbsolute,
	);

	for (const [language, { file }] of languageFileFactory.entries()) {
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

	return {
		...results,
		reports: filteredReports,
	};
}
