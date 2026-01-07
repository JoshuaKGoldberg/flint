import { makeAbsolute } from "@flint.fyi/utils";
import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";

import { ProcessedConfigDefinition } from "../types/configs.js";
import {
	AnyLanguage,
	AnyLanguageFileDefinition,
	AnyLanguageFileMetadata,
	LanguageFileMetadata,
} from "../types/languages.js";
import { AnyRule } from "../types/rules.js";
import { computeUseDefinitions } from "./computeUseDefinitions.js";

const log = debugForFile(import.meta.filename);

export type GroupsOfFilesAndOptions = [AnyLanguageFileDefinition[], object][];

export interface LanguageAndPreparedFiles {
	language: AnyLanguage;
	languageFilesMetadata: AnyLanguageFileMetadata[];
}

export interface LanguageFilesAndRulesOptions {
	languagesPreparedByFilePath: Map<string, LanguageAndPreparedFiles>;
	rulesFilesAndOptionsByRule: Map<AnyRule, GroupsOfFilesAndOptions>;
}

export async function collectFileLanguagesAndRuleOptions(
	configDefinition: ProcessedConfigDefinition,
): Promise<LanguageFilesAndRulesOptions> {
	const useDefinitions = await computeUseDefinitions(configDefinition);

	// 1. For each rule, create a map of the files it's enabled on & with which options
	// Also store the total list of file paths

	const allFoundFiles = new Set<string>(); // TODO: necessary?
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
				allFoundFiles.add(filePath);
				rulesOptionsByFile.get(rule).set(filePath, options);
			}
		}
	}

	// 2. From the rules' maps of files -> options, generate the corresponding language file(s)

	const languageFilesMetadata = new CachedFactory((language: AnyLanguage) => ({
		fileFactory: language.prepare(),
		fileMetadataByPath: new Map<string, AnyLanguageFileMetadata>(),
	}));
	const languagesByFilePath = new CachedFactory<string, Set<AnyLanguage>>(
		() => new Set<AnyLanguage>(),
	);

	for (const [rule, optionsByFile] of rulesOptionsByFile.entries()) {
		for (const [filePath] of optionsByFile) {
			const { fileFactory, fileMetadataByPath } = languageFilesMetadata.get(
				rule.language,
			);

			fileMetadataByPath.set(
				filePath,
				fileFactory.prepareFromDisk({
					filePath,
					filePathAbsolute: makeAbsolute(filePath),
				}),
			);
			languagesByFilePath.get(filePath).add(rule.language);
		}
	}

	// 3. Join the two together: for each rule, collect its language and files

	const rulesFilesAndOptionsByRule = new Map<
		AnyRule,
		GroupsOfFilesAndOptions
	>();

	for (const [rule, optionsByFilePath] of rulesOptionsByFile.entries()) {
		// type GroupsOfFilesAndOptions = [AnyLanguageFileDefinition[], object][];
		const groupsOfFilesAndOptions: GroupsOfFilesAndOptions = [];
		rulesFilesAndOptionsByRule.set(rule, groupsOfFilesAndOptions);

		for (const [filePath, options] of optionsByFilePath) {
			const languagesForFilePath = languagesByFilePath.get(filePath);

			groupsOfFilesAndOptions.push(
				Array.from(languagesByFilePath.get(filePath)).map,
				options,
			);
		}
	}
}
