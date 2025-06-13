import { FileRuleReport, FileRuleReportWithFix } from "../types/reports.js";

export function hasFix(
	report: FileRuleReport,
): report is FileRuleReportWithFix {
	return !!("fix" in report);
}
