import { FileReport } from "../types/reports.js";
import { RangedSelection } from "./computeDirectiveRanges.js";
import { selectionMatchesReport } from "./selectionMatchesReport.js";

export function selectionMatchesDirectiveRanges(
	directiveRanges: RangedSelection[],
	report: FileReport,
) {
	// TODO: It'd be faster to use a tracking cursor, binary search tree, or etc.
	// But there should be a small enough number of directives that this is fine.
	// Someone should at least investigate to confirm there's no real perf difference.
	const matchingRange = directiveRanges.find(
		(directiveRange) =>
			directiveRange.lines.begin <= report.range.begin.line &&
			directiveRange.lines.end >= report.range.begin.line,
	);

	return (
		!!matchingRange &&
		matchingRange.selections.some((selection) =>
			selectionMatchesReport(selection, report),
		)
	);
}
