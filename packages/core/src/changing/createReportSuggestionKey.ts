import { Suggestion } from "../types/changes.js";
import { FileReport } from "../types/reports.js";

export function createReportSuggestionKey(
	report: FileReport,
	suggestion: Suggestion,
) {
	return [report.about.id, suggestion.id].join(":");
}
