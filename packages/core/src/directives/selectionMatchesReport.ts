import { FileReport } from "../types/reports.js";

// TODO: There's got to be a better way.
// Maybe an existing common one like minimatch?
export function selectionMatchesReport(matcher: RegExp, report: FileReport) {
	return matcher.test(
		// TODO: Factor in plugins / core?
		report.about.id,
	);
}
