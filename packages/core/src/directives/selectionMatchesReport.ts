import type { FileReport } from "../types/reports.js";

// TODO: There's got to be a better way.
// Maybe an existing common one like minimatch?
// https://github.com/JoshuaKGoldberg/flint/issues/245
export function selectionMatchesReport(matcher: RegExp, report: FileReport) {
	return matcher.test(
		// TODO: Factor in plugin names, when available
		// https://github.com/JoshuaKGoldberg/flint/issues/248
		report.about.id,
	);
}
