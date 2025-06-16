import { VirtualFile } from "../files/VirtualFile.js";
import { FileRuleReport, FileRuleReportWithFix } from "./reports.js";

export interface FileResults {
	allReports: FileRuleReport[];
	fixableReports: FileRuleReportWithFix[];
	originalContent: string;
	virtualFile: VirtualFile;
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
