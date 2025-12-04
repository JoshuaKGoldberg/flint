import { makeAbsolute } from "@flint.fyi/utils";
import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";
import * as fs from "node:fs/promises";
import path from "node:path";

import { readFromCache } from "../cache/readFromCache.js";
import { writeToCache } from "../cache/writeToCache.js";
import { collectFilesValues } from "../globs/collectFilesValues.js";
import { AnyLevelDeep } from "../types/arrays.js";
import {
	ConfigRuleDefinition,
	ConfigUseDefinition,
	ProcessedConfigDefinition,
} from "../types/configs.js";
import { FilesGlobObjectProcessed, FilesValue } from "../types/files.js";
import { AnyLanguage } from "../types/languages.js";
import { FileResults, LintResults } from "../types/linting.js";
import { flatten } from "../utils/arrays.js";
import { computeRulesWithOptions } from "./computeRulesWithOptions.js";
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
	interface ConfigUseDefinitionWithFiles extends ConfigUseDefinition {
		found: Set<string>;
		rules: ConfigRuleDefinition[];
	}

	const gitignore = await readGitignore();

	log("Collecting files from %d use pattern(s)", configDefinition.use.length);
	log("Excluding based on .gitignore: %s", gitignore);

	const useDefinitions: ConfigUseDefinitionWithFiles[] = await Promise.all(
		configDefinition.use.map(async (use) => {
			const globs = resolveUseFilesGlobs(use.files, configDefinition);

			return {
				...use,
				found: new Set(
					(
						await Array.fromAsync(
							fs.glob([globs.include].flat(), {
								exclude: [...gitignore, ...globs.exclude],
								withFileTypes: true,
							}),
						)
					)
						.filter((entry) => entry.isFile())
						.map((entry) =>
							path.relative(
								process.cwd(),
								makeAbsolute(path.join(entry.parentPath, entry.name)),
							),
						),
				),
				rules: use.rules ? flatten(use.rules) : [],
			};
		}),
	);

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

	const rulesWithOptions = computeRulesWithOptions(
		useDefinitions.flatMap((use) => use.rules),
	);

	const languageFiles = new CachedFactory(
		([language, filePathAbsolute]: [AnyLanguage, string]) =>
			languageFactories.get(language).prepareFromDisk(filePathAbsolute),
	);

	// TODO: It would probably be good to group rules by language...
	for (const [rule, options] of rulesWithOptions) {
		const runtime = await rule.setup(options);
		log("Running rule %s with options: %o", rule.about.id, options);

		// TODO: this does an await in a for loop - should it use a queue?
		for (const filePath of allFilePaths) {
			const filePathAbsolute = makeAbsolute(filePath);

			// TODO: How to make types more permissive around assignability?
			// See AnyRule's any
			const { file } = languageFactories
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				.get(rule.language)
				.prepareFromDisk(filePathAbsolute);

			log("Linting: %s:", filePathAbsolute);

			const { dependencies, diagnostics, reports } =
				cached?.get(filePath) ??
				(await lintFile(
					filePathAbsolute,
					file,
					rule,
					runtime,
					skipDiagnostics,
					languageFiles,
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
	}

	log("Found %d report(s)", totalReports);

	const lintResults = { allFilePaths, cached, filesResults };

	await writeToCache(configDefinition.filePath, lintResults);

	return lintResults;
}

function collectUseFilesGlobsObject(
	files: AnyLevelDeep<FilesValue> | undefined,
	configDefinition: ProcessedConfigDefinition,
): FilesGlobObjectProcessed {
	switch (typeof files) {
		case "function":
			return resolveUseFilesGlobs(files(configDefinition), configDefinition);

		case "undefined":
			return { exclude: [], include: [] };

		default: {
			const exclude = new Set<string>();
			const include = new Set<string>();

			collectFilesValues(flatten(files), exclude, include);

			return {
				exclude: Array.from(exclude),
				include: Array.from(include),
			};
		}
	}
}

function resolveUseFilesGlobs(
	files: AnyLevelDeep<FilesValue> | undefined,
	configDefinition: ProcessedConfigDefinition,
): FilesGlobObjectProcessed {
	const globs = collectUseFilesGlobsObject(files, configDefinition);

	return {
		exclude: [...globs.exclude, ...(configDefinition.ignore ?? [])],
		include: globs.include,
	};
}
