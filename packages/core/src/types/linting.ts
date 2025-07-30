import { FileCacheStorage } from "./cache.js";
import { LanguageFileDiagnostic } from "./languages.js";
import { FileRuleReport, FileRuleReportWithFix } from "./reports.js";

export interface FileResults {
	dependencies: Set<string>;
	diagnostics: LanguageFileDiagnostic[];
	reports: FileRuleReport[];
}

export interface FileResultsWithFixes extends FileResults {
	fixableReports: FileRuleReportWithFix[];
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
