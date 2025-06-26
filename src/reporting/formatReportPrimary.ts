import { NormalizedRuleReport } from "../types/reports.js";

/**
 * Interpolates any report data into its primary message.
 */
export function formatReportPrimary(report: NormalizedRuleReport) {
	let result = report.message.primary;

	if (report.data) {
		for (const [key, value] of Object.entries(report.data)) {
			result = result.replaceAll(`{{ ${key} }}`, String(value));
		}
	}

	return result;
}
