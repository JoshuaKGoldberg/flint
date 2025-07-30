import { formatReportPrimary, hasFix } from "@flint.fyi/core";
import { makeAbsolute } from "@flint.fyi/utils";
import { styleText } from "node:util";
import { textTable } from "text-table-fast";

import { presentHeader } from "./shared/header.js";
import { presentDiagnostics } from "./shared/presentDiagnostics.js";
import { presentSummary } from "./shared/summary.js";
import { PresenterFactory } from "./types.js";

export const briefPresenterFactory: PresenterFactory = {
	about: {
		name: "brief",
	},
	initialize(initializeContext) {
		const counts = { all: 0, files: 0, fixable: 0 };

		return {
			header: presentHeader(initializeContext),
			*renderFile({ file, reports }) {
				counts.all += reports.length;
				counts.files += 1;
				counts.fixable += reports.filter(hasFix).length;

				yield "\n";
				yield styleText("underline", makeAbsolute(file.filePath));
				yield "\n";

				yield textTable(
					reports
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
							styleText("yellow", report.about.id),
							"\n",
						]),
				);

				yield "\n";
			},
			*summarize(summaryContext) {
				yield* presentSummary(counts, summaryContext);
				yield* presentDiagnostics(summaryContext.runConfigResults.filesResults);
			},
		};
	},
};
