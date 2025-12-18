import { formatReportPrimary, NormalizedReport } from "@flint.fyi/core";

export function createReportsOutput(
	sourceText: string,
	reports: NormalizedReport[],
) {
	let result = sourceText;

	for (const report of reports.toReversed()) {
		result = createReportsOutputAt(result, report);
	}

	return result;
}

function createReportsOutputAt(sourceText: string, report: NormalizedReport) {
	const { begin, end } = report.range;
	const lineStartIndex = sourceText.lastIndexOf("\n", begin.raw) + 1;
	let lineEndIndex = sourceText.indexOf("\n", end.raw);
	if (lineEndIndex < 0) {
		lineEndIndex = sourceText.length;
	}
	const sourceLines = sourceText
		.slice(lineStartIndex, lineEndIndex)
		.split("\n");
	const reportedLines: string[] = [];

	for (let i = begin.line; i <= end.line; i++) {
		const line = sourceLines[i - begin.line];
		reportedLines.push(line);

		const prevLineIndent = /^[\t ]*/.exec(line)?.[0] ?? "";

		if (i === begin.line) {
			const indent = prevLineIndent.padEnd(begin.column, " ");
			const squiggleEnd = begin.line === end.line ? end.column : line.length;
			reportedLines.push(indent.padEnd(squiggleEnd, "~"));
			for (const errorMessageLine of formatReportPrimary(report).split("\n")) {
				reportedLines.push(indent + errorMessageLine);
			}
		} else {
			const squiggleEnd = i === end.line ? end.column : line.length;
			reportedLines.push(prevLineIndent.padEnd(squiggleEnd, "~"));
		}
	}

	return (
		sourceText.slice(0, lineStartIndex) +
		reportedLines.join("\n") +
		sourceText.slice(lineEndIndex)
	);
}
