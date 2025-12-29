import { type FileResults, hasFix } from "@flint.fyi/core";
import { styleText } from "node:util";

import { pluralize } from "../../presenters/pluralize.ts";

export function printSummary(filesWithReportResults: [string, FileResults][]) {
	const counts = {
		all: filesWithReportResults.reduce(
			(sum, next) => sum + next[1].reports.length,
			0,
		),
		files: filesWithReportResults.length,
		fixable: filesWithReportResults.reduce(
			(sum, next) => sum + next[1].reports.filter(hasFix).length,
			0,
		),
	};

	return styleText(
		"red",
		[
			"\u2716 Found ",
			styleText("bold", pluralize(counts.all, "report")),
			" across ",
			styleText("bold", pluralize(counts.files, "file")),
			...(counts.fixable
				? [
						" (",
						styleText("bold", pluralize(counts.fixable, "fixable with --fix")),
						")",
					]
				: []),
			".",
		].join(""),
	);
}
