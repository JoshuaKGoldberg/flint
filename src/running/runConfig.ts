import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";
import * as fs from "node:fs/promises";

import { readFromCache } from "../cache/readFromCache.js";
import {
	ConfigDefinition,
	ConfigRuleDefinition,
	ConfigUseDefinition,
} from "../types/configs.js";
import { AnyLanguage } from "../types/languages.js";
import { FileResults, RunConfigResults } from "../types/linting.js";
import { makeAbsolute } from "../utils/makeAbsolute.js";
import { lintFile } from "./lintFile.js";
import { readGitignore } from "./readGitignore.js";

const log = debugForFile(import.meta.filename);

export async function runConfig(
	config: ConfigDefinition,
): Promise<RunConfigResults> {
	interface ConfigUseDefinitionWithFiles extends ConfigUseDefinition {
		files: Set<string>;
		rules: ConfigRuleDefinition[];
	}

	const gitignore = await readGitignore();

	log("Collecting files from %d use pattern(s)", config.use.length);
	log("Excluding based on .gitignore: %s", gitignore);

	const useDefinitions: ConfigUseDefinitionWithFiles[] = await Promise.all(
		config.use.map(async (use) => ({
			...use,
			files: new Set(
				await Array.fromAsync(
					fs.glob([use.glob].flat() as string[], {
						exclude: [gitignore, ...(config.ignore ?? [])].flat(),
					}),
				),
			),
			rules: (use.rules?.flat() ?? []) as ConfigRuleDefinition[],
		})),
	);

	const allFilePaths = new Set(
		useDefinitions.flatMap((use) => Array.from(use.files)),
	);
	const filesResults = new Map<string, FileResults>();
	let totalReports = 0;

	const fileFactories = new CachedFactory((language: AnyLanguage) =>
		language.prepare(),
	);

	const cached = await readFromCache(allFilePaths);

	// TODO: This is very slow and the whole thing should be refactored 🙌.
	// The separate lintFile function recomputes rule options repeatedly.
	// It'd be better to group files together in some way.
	for (const filePath of allFilePaths) {
		const { dependencies, reports } =
			cached?.get(filePath) ??
			lintFile(
				fileFactories,
				makeAbsolute(filePath),
				useDefinitions
					.filter((use) => use.files.has(filePath))
					.flatMap((use) => use.rules),
			);

		filesResults.set(filePath, {
			dependencies: new Set(dependencies),
			reports: reports ?? [],
		});

		if (reports?.length) {
			totalReports += reports.length;
		}
	}

	log("Found %d report(s)", totalReports);

	return { allFilePaths, cached, filesResults };
}
