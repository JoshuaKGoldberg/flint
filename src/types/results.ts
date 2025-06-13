import { FileRuleReport, FileRuleReportWithFix } from "./reports.js";

export interface FileResults {
	allReports: FileRuleReport[];
	originalContent: string;
}

export interface FileResultsWithFixes extends FileResults {
	fixableReports: FileRuleReportWithFix[];
}

export interface RunConfigResults {
	filesResults: Map<string, FileResults>;
}

export interface RunConfigResultsMaybeWithFixes extends RunConfigResults {
	fixed?: Set<string>;
}

export interface RunConfigResultsWithFixes extends RunConfigResults {
	fixed: Set<string>;
}
