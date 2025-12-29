import type { Change, SuggestionForFiles } from "../types/changes.js";
import type { FileReport, FileReportWithFix } from "../types/reports.js";

export function hasFix(report: FileReport): report is FileReportWithFix {
	return report.fix != null;
}

export function isSuggestionForFiles(
	change: Change,
): change is SuggestionForFiles {
	return "files" in change;
}
