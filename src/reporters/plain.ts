import { styleText } from "node:util";
import { textTable } from "text-table-fast";

import { FilesRuleReports } from "../types/reports.js";
import { makeAbsolute } from "../utils/makeAbsolute.js";

export function* plainReporter(filesRuleReports: FilesRuleReports) {
	if (filesRuleReports.size === 0) {
		yield styleText("green", "No issues found.");
		return;
	}

	const totalFiles = filesRuleReports.size;
	let totalReports = 0;

	yield "";

	for (const [filePath, ruleReports] of filesRuleReports) {
		totalReports += ruleReports.length;

		yield styleText("underline", makeAbsolute(filePath));

		yield textTable(
			ruleReports
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

	yield styleText(
		"red",
		[
			"✖ Found ",
			styleText("bold", pluralize(totalReports, "report")),
			" across ",
			styleText("bold", pluralize(totalFiles, "file")),
			".",
		].join(""),
	);
}

function pluralize(count: number, label: string) {
	return `${count} ${label}${count !== 1 ? "s" : ""}`;
}
