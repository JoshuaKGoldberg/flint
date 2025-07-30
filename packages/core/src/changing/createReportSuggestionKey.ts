import { Suggestion } from "../types/changes.js";
import { FileRuleReport } from "../types/reports.js";

export function createReportSuggestionKey(
	report: FileRuleReport,
	suggestion: Suggestion,
) {
	return [report.about.id, suggestion.id].join(":");
}
