import { FileCacheStorage } from "./cache.js";
import { LanguageFileDiagnostic } from "./languages.js";
import { FileReport } from "./reports.js";

export interface FileResults {
	dependencies: Set<string>;
	diagnostics: LanguageFileDiagnostic[];
	reports: FileReport[];
}

export interface LintResults {
	allFilePaths: Set<string>;
	cached: Map<string, FileCacheStorage> | undefined;
	filesResults: Map<string, FileResults>;
}

export interface LintResultsMaybeWithChanges extends LintResults {
	changed?: Set<string>;
}

export interface LintResultsWithChanges extends LintResults {
	changed: Set<string>;
}
