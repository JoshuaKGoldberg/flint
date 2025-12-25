import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";

import { readFromCache } from "../cache/readFromCache.js";
import { writeToCache } from "../cache/writeToCache.js";
import { ProcessedConfigDefinition } from "../types/configs.js";
import { AnyLanguage } from "../types/languages.js";
import { FileResults, LintResults } from "../types/linting.js";
import { AnyRule } from "../types/rules.js";
import { computeUseDefinitions } from "./computeUseDefinitions.js";
import { lintFile, RuntimeStorage } from "./lintFile.js";

const log = debugForFile(import.meta.filename);

export interface LintOnceSettings {
	ignoreCache: boolean;
	skipDiagnostics: boolean;
}

/**
 * This is a mispeling.
 */
export async function lintOnce(
	configDefinition: ProcessedConfigDefinition,
	{ ignoreCache, skipDiagnostics }: LintOnceSettings,
): Promise<LintResults> {
	const useDefinitions = await computeUseDefinitions(configDefinition);
	const allFilePaths = new Set(
		useDefinitions.flatMap((use) => Array.from(use.found)),
	);
	const filesResults = new Map<string, FileResults>();
	let totalReports = 0;

	const languageFileFactoryFactory = new CachedFactory(
		(language: AnyLanguage) => language.prepare(),
	);

	const runtimeStorage = {} as RuntimeStorage;

	const ruleRuntimeFactory = new CachedFactory(async (rule: AnyRule) => {
		log("Running rule %s setup:", rule.about.id);
		return await rule.setup({
			report(ruleReport) {
				runtimeStorage.reports.push({
					...ruleReport,
					about: rule.about,
					fix:
						ruleReport.fix && !Array.isArray(ruleReport.fix)
							? [ruleReport.fix]
							: ruleReport.fix,
					message: rule.messages[ruleReport.message],
					range: runtimeStorage.file.normalizeRange(ruleReport.range),
				});
			},
		});
	});

	const cachedFileReports = ignoreCache
		? undefined
		: await readFromCache(allFilePaths, configDefinition.filePath);

	for (const filePath of allFilePaths) {
		const { dependencies, diagnostics, reports } =
			cachedFileReports?.get(filePath) ??
			(await lintFile(
				filePath,
				languageFileFactoryFactory,
				// TODO: How to make types more permissive around assignability?
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				ruleRuntimeFactory,
				runtimeStorage,
				useDefinitions,
				skipDiagnostics,
			));

		filesResults.set(filePath, {
			dependencies: new Set(dependencies),
			diagnostics: diagnostics ?? [],
			reports: reports ?? [],
		});

		if (reports?.length) {
			totalReports += reports.length;
		}
	}

	log("Found %d report(s)", totalReports);

	const lintResults = { allFilePaths, cached: cachedFileReports, filesResults };

	await writeToCache(configDefinition.filePath, lintResults);

	return lintResults;
}
