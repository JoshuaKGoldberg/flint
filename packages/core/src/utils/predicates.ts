import { Change, SuggestionForFiles } from "../types/changes.js";
import { FileReport, FileReportWithFix } from "../types/reports.js";

export function hasFix(report: FileReport): report is FileReportWithFix {
	return "fix" in report;
}

export function isSuggestionForFiles(
	change: Change,
): change is SuggestionForFiles {
	return "files" in change;
}
