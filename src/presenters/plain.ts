import { styleText } from "node:util";
import { textTable } from "text-table-fast";

import { formatReportPrimary } from "../reporting/formatReportPrimary.js";
import { Presenter } from "../types/presenters.js";
import { makeAbsolute } from "../utils/makeAbsolute.js";
import { hasFix } from "../utils/predicates.js";

export const plainPresenter: Presenter = {
	begin(configFileName) {
		console.log(styleText("gray", `Linting with ${configFileName}...`));
	},
	end(configResults, formattingResults) {
		const reportTotals = { all: 0, fixable: 0 };

		for (const [filePath, fileResult] of configResults.filesResults) {
			if (fileResult.reports.length === 0) {
				continue;
			}

			reportTotals.all += fileResult.reports.length;
			reportTotals.fixable += fileResult.reports.filter(hasFix).length;

			console.log(styleText("underline", makeAbsolute(filePath)));

			console.log(
				textTable(
					fileResult.reports
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
							formatReportPrimary(report),
							styleText("yellow", report.ruleId),
						]),
				),
			);

			console.log("");
		}

		if (configResults.fixed?.size) {
			console.log(
				styleText(
					"green",
					[
						"✔ Fixed ",
						styleText("bold", pluralize(configResults.fixed.size, "file")),
						" automatically (--fix).",
					].join(""),
				),
			);
		}

		if (reportTotals.all === 0) {
			console.log(styleText("green", "No linting issues found."));
		} else {
			console.log(
				styleText(
					"red",
					[
						"\u2716 Found ",
						styleText("bold", pluralize(reportTotals.all, "report")),
						" across ",
						styleText(
							"bold",
							pluralize(configResults.filesResults.size, "file"),
						),
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
				),
			);
		}

		if (formattingResults.dirty.size) {
			console.log("");

			if (formattingResults.written) {
				console.log(
					styleText(
						"blue",
						[
							"✳ Cleaned ",
							styleText(
								"bold",
								pluralize(formattingResults.dirty.size, "file"),
							),
							"'s formatting with Prettier (--fix):",
						].join(""),
					),
				);
			} else {
				console.log(
					styleText(
						"blue",
						[
							"✳ Found ",
							styleText(
								"bold",
								pluralize(formattingResults.dirty.size, "file"),
							),
							" with Prettier formatting differences (add ",
							styleText("bold", "--fix"),
							" to rewrite):",
						].join(""),
					),
				);
			}

			for (const dirtyFile of formattingResults.dirty) {
				console.log(`  ${styleText("gray", dirtyFile)}`);
			}
		}
	},
};

function pluralize(count: number, label: string) {
	return `${count} ${label}${count !== 1 ? "s" : ""}`;
}
