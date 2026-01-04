import { makeAbsolute } from "@flint.fyi/utils";
import { CachedFactory } from "cached-factory";

import type { ProcessedConfigDefinition } from "../types/configs.ts";
import type {
	AnyLanguage,
	AnyLanguageFileMetadata,
} from "../types/languages.ts";
import type { AnyRule } from "../types/rules.ts";
import { computeUseDefinitions } from "./computeUseDefinitions.ts";
import type { LanguageFilesAndRulesOptions } from "./types.ts";

// TODO: This is very slow and the whole thing should be refactored 🙌.
// Creating arrays and Maps and Sets per rule x per file is a lot of memory!
export async function collectFileLanguagesAndRuleOptions(
	configDefinition: ProcessedConfigDefinition,
): Promise<LanguageFilesAndRulesOptions> {
	const { allFilePaths, useDefinitions } =
		await computeUseDefinitions(configDefinition);

	// 1. For each rule, create a map of the files it's enabled on & with which options

	const rulesOptionsByFile = new CachedFactory<AnyRule, Map<string, unknown>>(
		() => new Map(),
	);

	for (const use of useDefinitions) {
		for (const ruleDefinition of use.rules) {
			const [options, rule] =
				"rule" in ruleDefinition
					? [ruleDefinition.options, ruleDefinition.rule]
					: [undefined, ruleDefinition];

			for (const filePath of use.found) {
				rulesOptionsByFile.get(rule).set(filePath, options);
			}
		}
	}

	// 2. From the rules' maps of files -> options, generate the corresponding language file(s) and metadata

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

	// 3. Join language metadata files into the corresponding options by file path
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
