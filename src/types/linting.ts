import { FileCacheStorage } from "./cache.js";
import { FileRuleReport, FileRuleReportWithFix } from "./reports.js";

export interface FileResults {
	dependencies: Set<string>;
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

export interface RunConfigResultsMaybeWithFixes extends RunConfigResults {
	fixed?: Set<string>;
}

export interface RunConfigResultsWithFixes extends RunConfigResults {
	fixed: Set<string>;
}
