import { makeAbsolute } from "@flint.fyi/utils";
import { CachedFactory } from "cached-factory";

import { readFromCache } from "../cache/readFromCache.ts";
import type { FileCacheStorage } from "../types/cache.ts";
import type { ProcessedConfigDefinition } from "../types/configs.ts";
import type {
	AnyLanguage,
	AnyLanguageFileMetadata,
} from "../types/languages.ts";
import type { AnyRule } from "../types/rules.ts";
import { computeUseDefinitions } from "./computeUseDefinitions.ts";
import type {
	LanguageAndFilesMetadata,
	LanguageFilesWithOptions,
} from "./types.ts";

/**
 * Collected information describing files to lint, along with metadata and rule options.
 */
export interface CollectedFilesAndMetadata {
	/**
	 * All file paths the user wants linted, including any previously cached ones.
	 */
	allFilePaths: Set<string>;

	/**
	 * Previously existing cache, if one could be found.
	 */
	cached: Map<string, FileCacheStorage> | undefined;

	/**
	 * For each file, all prepared language file metadata wrappers around it.
	 */
	languageFileMetadataByFilePath: Map<string, LanguageAndFilesMetadata[]>;

	/**
	 * For each rule, the array of files to lint with which options.
	 *
	 * Note that this should not include cached files.
	 * Those files don't need to have metadata wrappers or options computed.
	 */
	rulesFilesAndOptionsByRule: Map<AnyRule, LanguageFilesWithOptions[]>;
}

// TODO: This is very slow and the whole thing should be refactored 🙌.
// Creating arrays and Maps and Sets per rule x per file is a lot of memory!
export async function collectFilesAndMetadata(
	configDefinition: ProcessedConfigDefinition,
	ignoreCache: boolean | undefined,
): Promise<CollectedFilesAndMetadata> {
	// 1. Collect all file paths to lint and the grouped 'use' rule configurations

	const { allFilePaths, useDefinitions } =
		await computeUseDefinitions(configDefinition);

	// 2. Retrieve any past cached results from those files

	const cached = ignoreCache
		? undefined
		: await readFromCache(allFilePaths, configDefinition.filePath);

	// 3. For each rule, create a map of the files it's enabled on & with which options

	const rulesOptionsByFile = new CachedFactory<AnyRule, Map<string, unknown>>(
		() => new Map(),
	);

	for (const use of useDefinitions) {
		for (const ruleDefinition of use.rules) {
			const [options, rule] =
				"rule" in ruleDefinition
					? [ruleDefinition.options, ruleDefinition.rule]
					: [{}, ruleDefinition];

			for (const filePath of use.found) {
				rulesOptionsByFile.get(rule).set(filePath, options);
			}
		}
	}

	// 4. From the rules' maps of files -> options, generate the corresponding language file(s) and metadata

	const languageFileMetadataByFilePath = new CachedFactory<
		string,
		Map<AnyLanguage, AnyLanguageFileMetadata>
	>(() => new Map());

	const languageFilesMetadata = new CachedFactory((language: AnyLanguage) => ({
		fileFactory: language.prepare(),
		fileMetadataByPath: new Map<string, AnyLanguageFileMetadata>(),
	}));

	for (const [rule, optionsByFile] of rulesOptionsByFile.entries()) {
		for (const [filePath] of optionsByFile) {
			// If the file has cached results, don't bother making files for it
			if (cached?.has(filePath)) {
				continue;
			}

			const { fileFactory, fileMetadataByPath } = languageFilesMetadata.get(
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				rule.language,
			);

			const fileMetadata = fileFactory.prepareFromDisk({
				filePath,
				filePathAbsolute: makeAbsolute(filePath),
			});

			fileMetadataByPath.set(filePath, fileMetadata);
			languageFileMetadataByFilePath
				.get(filePath)
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				.set(rule.language, fileMetadata);
		}
	}

	// 5. Join language metadata files into the corresponding options by file path

	const rulesFilesAndOptionsByRule = new Map(
		Array.from(rulesOptionsByFile.entries()).map(([rule, optionsByFile]) => [
			rule,
			Array.from(optionsByFile).map(([filePath, options]) => ({
				languageFiles: Array.from(
					languageFileMetadataByFilePath
						.get(filePath)
						.values()
						.map((fileMetadata) => fileMetadata.file),
				),
				options,
			})),
		]),
	);

	return {
		allFilePaths,
		cached,
		languageFileMetadataByFilePath: new Map(
			Array.from(languageFileMetadataByFilePath.entries()).map(
				([filePath, fileMetadataByLanguage]) => [
					filePath,
					Array.from(fileMetadataByLanguage.entries()).map(
						([language, fileMetadata]) => ({
							fileMetadata,
							language,
						}),
					),
				],
			),
		),
		rulesFilesAndOptionsByRule,
	};
}
