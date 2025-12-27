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

	/**
	 * Value references that change across uses of a singleton rule runtime.
	 * @see {@link lintFile} for where this storage is used.
	 * @see {@link ruleRuntimeFactory} for creating singleton rule runtimes.
	 */
	const runtimeStorage = {} as RuntimeStorage;

	/**
	 * This factory creates a singleton "runtime" at for each rule.
	 * That runtime is the same across all files that run the rule.
	 * The {@link runtimeStorage} variable is used for storage that needs to
	 * be "reset" each time a new rule is run with the same runtime.
	 */
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
		const lintResults =
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
			dependencies: new Set(lintResults.dependencies),
			diagnostics: lintResults.diagnostics ?? [],
			reports: lintResults.reports ?? [],
		});

		if (lintResults.reports?.length) {
			totalReports += lintResults.reports.length;
		}
	}

	log("Found %d report(s)", totalReports);

	const lintResults = { allFilePaths, cached: cachedFileReports, filesResults };

	await writeToCache(configDefinition.filePath, lintResults);

	return lintResults;
}
