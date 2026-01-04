import type {
	AnyLanguage,
	AnyLanguageFileDefinition,
	AnyLanguageFileMetadata,
} from "../types/languages.ts";
import type { AnyRule } from "../types/rules.ts";

export interface LanguageAndFilesMetadata {
	fileMetadata: AnyLanguageFileMetadata;
	language: AnyLanguage;
}

export interface LanguageFilesAndRulesOptions {
	allFilePaths: Set<string>;
	languageFileMetadataByFilePath: Map<string, LanguageAndFilesMetadata[]>;
	rulesFilesAndOptionsByRule: Map<AnyRule, LanguageFilesWithOptions[]>;
}

export interface LanguageFilesWithOptions {
	languageFiles: AnyLanguageFileDefinition[];
	options: unknown;
}
