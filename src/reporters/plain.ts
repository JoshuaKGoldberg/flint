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
			ruleReports.map((report) => [
				styleText("gray", `  ${report.range.begin}:${report.range.end}`),
				report.message,
				styleText("yellow", report.ruleId),
			]),
		);

		yield "";
	}

	yield styleText(
		"red",
		[
			"✖ Found ",
			pluralize(totalReports, styleText("bold", `report`)),
			" across ",
			pluralize(totalFiles, styleText("bold", `file`)),
			".",
		].join(""),
	);
}

function pluralize(count: number, label: string) {
	return `${styleText("bold", count.toString())} ${label}${count !== 1 ? "s" : ""}`;
}
