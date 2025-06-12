import { NormalizedRuleReport } from "../types/reports.js";

export function createReportSnapshot(
	sourceText: string,
	reports: NormalizedRuleReport[],
) {
	let result = sourceText;

	for (const report of reports.toReversed()) {
		result = createReportSnapshotAt(result, report);
	}

	return result;
}

function createReportSnapshotAt(
	sourceText: string,
	report: NormalizedRuleReport,
) {
	const range = report.range;

	const lineEndIndex = ifNegative(
		sourceText.indexOf("\n", range.begin.raw),
		sourceText.length,
	);
	const lineStartIndex = ifNegative(
		sourceText.lastIndexOf("\n", range.begin.raw),
		0,
	);

	const column = ifNegative(range.begin.raw - lineStartIndex - 2, 0);
	const width = range.end.raw - range.begin.raw;

	const injectionPrefix = " ".repeat(column);
	const injectedLines = [
		injectionPrefix + "~".repeat(width),
		injectionPrefix + report.message,
	];

	return [
		sourceText.slice(0, lineEndIndex),
		...injectedLines,
		sourceText.slice(lineEndIndex + 1),
	].join("\n");
}

function ifNegative(value: number, fallback: number) {
	return value < 0 ? fallback : value;
}
