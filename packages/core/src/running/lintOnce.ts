import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";

import { readFromCache } from "../cache/readFromCache.js";
import { writeToCache } from "../cache/writeToCache.js";
import { ProcessedConfigDefinition } from "../types/configs.js";
import { AnyLanguage } from "../types/languages.js";
import { FileResults, LintResults } from "../types/linting.js";
import { computeUseDefinitions } from "./computeUseDefinitions.js";
import { lintFile } from "./lintFile.js";
import { readGitignore } from "./readGitignore.js";

const log = debugForFile(import.meta.filename);

export interface LintOnceSettings {
	ignoreCache: boolean;
	skipDiagnostics: boolean;
}

export async function lintOnce(
	configDefinition: ProcessedConfigDefinition,
	{ ignoreCache, skipDiagnostics }: LintOnceSettings,
): Promise<LintResults> {
	const gitignore = await readGitignore();

	log("Collecting files from %d use pattern(s)", configDefinition.use.length);
	log("Excluding based on .gitignore: %s", gitignore);

	const useDefinitions = await computeUseDefinitions(configDefinition);

	const allFilePaths = new Set(
		useDefinitions.flatMap((use) => Array.from(use.found)),
	);
	const filesResults = new Map<string, FileResults>();
	let totalReports = 0;

	const languageFactories = new CachedFactory((language: AnyLanguage) => {
		return language.prepare();
	});

	const cached = ignoreCache
		? undefined
		: await readFromCache(allFilePaths, configDefinition.filePath);

	// TODO: This is very slow and the whole thing should be refactored 🙌.
	// The separate lintFile function recomputes rule options repeatedly.
	// It'd be better to group found files together in some way.
	// Plus, this does an await in a for loop - should it use a queue?
	for (const filePath of allFilePaths) {
		const { dependencies, diagnostics, reports } =
			cached?.get(filePath) ??
			(await lintFile(
				filePath,
				languageFactories,
				skipDiagnostics,
				useDefinitions,
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

	const lintResults = { allFilePaths, cached, filesResults };

	await writeToCache(configDefinition.filePath, lintResults);

	return lintResults;
}
