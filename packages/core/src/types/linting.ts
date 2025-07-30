import { FileCacheStorage } from "./cache.js";
import { LanguageFileDiagnostic } from "./languages.js";
import { FileRuleReport } from "./reports.js";

export interface FileResults {
	dependencies: Set<string>;
	diagnostics: LanguageFileDiagnostic[];
	reports: FileRuleReport[];
}

export interface RunConfigResults {
	allFilePaths: Set<string>;
	cached?: Map<string, FileCacheStorage>;
	filesResults: Map<string, FileResults>;
}

export interface RunConfigResultsMaybeWithChanges extends RunConfigResults {
	changed?: Set<string>;
}

export interface RunConfigResultsWithChanges extends RunConfigResults {
	changed: Set<string>;
}
