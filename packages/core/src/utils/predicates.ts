import { Change, SuggestionForFiles } from "../types/changes.js";
import { FileRuleReport, FileRuleReportWithFix } from "../types/reports.js";

export function hasFix(
	report: FileRuleReport,
): report is FileRuleReportWithFix {
	return !!("fix" in report);
}

export function isSuggestionForFiles(
	change: Change,
): change is SuggestionForFiles {
	return "files" in change;
}
