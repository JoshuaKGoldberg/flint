import { styleText } from "node:util";
import { textTable } from "text-table-fast";

import { RunConfigResultsMaybeWithFixes } from "../types/results.js";
import { makeAbsolute } from "../utils/makeAbsolute.js";
import { hasFix } from "../utils/predicates.js";

export function* plainReporter(results: RunConfigResultsMaybeWithFixes) {
	if (results.filesResults.size === 0) {
		yield styleText("green", "No issues found.");
		return;
	}

	const reportTotals = { all: 0, fixable: 0 };

	yield "";

	for (const [filePath, fileResult] of results.filesResults) {
		reportTotals.all += fileResult.allReports.length;
		reportTotals.fixable += fileResult.allReports.filter(hasFix).length;

		yield styleText("underline", makeAbsolute(filePath));

		yield textTable(
			fileResult.allReports
				.sort((a, b) =>
					a.range.begin.line === b.range.begin.line
						? a.range.begin.column - b.range.begin.column
						: a.range.begin.line - b.range.begin.line,
				)
				.map((report) => [
					styleText(
						"gray",
						`  ${report.range.begin.line}:${report.range.begin.column}`,
					),
					report.message.primary,
					styleText("yellow", report.ruleId),
				]),
		);

		yield "";
	}

	if (results.fixed) {
		yield styleText(
			"green",
			[
				"✔ Fixed ",
				styleText("bold", pluralize(results.fixed.size, "file")),
				" automatically with --fix.",
			].join(""),
		);
	}

	yield styleText(
		"red",
		[
			"✖ Found ",
			styleText("bold", pluralize(reportTotals.all, "report")),
			" across ",
			styleText("bold", pluralize(results.filesResults.size, "file")),
			...(reportTotals.fixable
				? [
						" (",
						styleText(
							"bold",
							pluralize(reportTotals.fixable, "fixable with --fix"),
						),
						")",
					]
				: []),
			".",
		].join(""),
	);
}

function pluralize(count: number, label: string) {
	return `${count} ${label}${count !== 1 ? "s" : ""}`;
}
