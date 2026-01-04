import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";

import { DirectivesFilterer } from "../directives/DirectivesFilterer.ts";
import type { FileCacheStorage } from "../types/cache.ts";
import type { ProcessedConfigDefinition } from "../types/configs.ts";
import type { LanguageFileDiagnostic } from "../types/languages.ts";
import type { LintResults } from "../types/linting.ts";
import type { FileReport } from "../types/reports.ts";
import type { AnyRule } from "../types/rules.ts";
import { collectFileLanguagesAndRuleOptions } from "./collectFileLanguagesAndRuleOptions.ts";
import { runLintRule } from "./runLintRule.ts";
import type {
	LanguageAndFilesMetadata,
	LanguageFilesWithOptions,
} from "./types.ts";

const log = debugForFile(import.meta.filename);

export interface RunConfigOptions {
	ignoreCache?: boolean;
	skipDiagnostics?: boolean;
}

export async function runConfig(
	configDefinition: ProcessedConfigDefinition,
	{ skipDiagnostics }: RunConfigOptions,
): Promise<LintResults> {
	// 1. Based on the original config definition, collect:
	//   - The full list of all file paths to be linted
	//   - The language (virtual) file representations
	//   - For each rule, the options it'll run with on each of its files
	const {
		allFilePaths,
		languageFileMetadataByFilePath,
		rulesFilesAndOptionsByRule,
	} = await collectFileLanguagesAndRuleOptions(configDefinition);

	// 2. For each lint rule, run it on all files and store each file's results
	const rulesReportsByFilePath = await runRules(rulesFilesAndOptionsByRule);

	// 3. Collect and finalize those file results into the filtered output
	const filesResults = new Map(
		Array.from(languageFileMetadataByFilePath).map(
			([filePath, languageAndFilesMetadata]) => [
				filePath,
				collectFinalizedFileResults(
					filePath,
					languageAndFilesMetadata,
					rulesReportsByFilePath.get(filePath).flat(),
					skipDiagnostics,
				),
			],
		),
	);

	// TODO: Caching! For PR #1100, need to add that back in!
	const cached = new Map<string, FileCacheStorage>();

	return { allFilePaths, cached, filesResults };
}

async function runRules(
	rulesFilesAndOptionsByRule: Map<AnyRule, LanguageFilesWithOptions[]>,
) {
	const rulesReportsByFilePath = new CachedFactory<string, FileReport[]>(
		() => [],
	);

	for (const [rule, filesAndOptions] of rulesFilesAndOptionsByRule) {
		const ruleReportsByFilePath = await runLintRule(rule, filesAndOptions);

		for (const [filePath, ruleReports] of ruleReportsByFilePath) {
			rulesReportsByFilePath.get(filePath).push(...ruleReports);
		}
	}

	return rulesReportsByFilePath;
}

/**
 * For a single file path, collects its:
 *   - Cache dependencies: from each language file
 *   - Diagnostics: from each language file (if not skipped)
 *   - Reports: from rules reports by file path
 * ...and then disposes of each language file.
 */
function collectFinalizedFileResults(
	filePath: string,
	languageAndFilesMetadata: LanguageAndFilesMetadata[],
	reports: FileReport[],
	skipDiagnostics?: boolean,
) {
	const directivesFilterer = new DirectivesFilterer();
	const fileDependencies = new Set<string>();
	const fileDiagnostics: LanguageFileDiagnostic[] = [];

	for (const { fileMetadata, language } of languageAndFilesMetadata) {
		if (fileMetadata.directives) {
			log(
				"Adding %d directives for file %s",
				fileMetadata.directives,
				filePath,
			);
			directivesFilterer.add(fileMetadata.directives);
		}

		if (fileMetadata.file.cache?.dependencies) {
			for (const dependency of fileMetadata.file.cache.dependencies) {
				if (!fileDependencies.has(dependency)) {
					log("Adding file dependency %s for file %s", dependency, filePath);
					fileDependencies.add(dependency);
				}
			}
		}

		if (!skipDiagnostics) {
			if (fileMetadata.file.getDiagnostics) {
				log(
					"Retrieving language %s diagnostics for file %s",
					language.about.name,
					filePath,
				);
				fileDiagnostics.push(...fileMetadata.file.getDiagnostics());
				log(
					"Retrieved language %s diagnostics for file %s",
					language.about.name,
					filePath,
				);
			}
		}

		log("Disposing language %s for file %s", language.about.name, filePath);
		fileMetadata.file[Symbol.dispose]();
		log("Disposed language %s for file %s", language.about.name, filePath);
	}

	return {
		dependencies: fileDependencies,
		diagnostics: fileDiagnostics,
		reports: directivesFilterer.filter(reports),
	};
}
