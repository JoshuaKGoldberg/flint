import { styleText } from "node:util";
import { textTable } from "text-table-fast";

import { formatReportPrimary } from "../reporting/formatReportPrimary.js";
import { Presenter } from "../types/presenters.js";
import { makeAbsolute } from "../utils/makeAbsolute.js";
import { hasFix } from "../utils/predicates.js";
import { presentHeader } from "./shared/header.js";
import { presentSummary } from "./shared/summary.js";

export const briefPresenter: Presenter = {
	about: {
		name: "brief",
	},
	initialize(initializeContext) {
		const counts = { all: 0, files: 0, fixable: 0 };

		return {
			header: presentHeader(initializeContext),
			runtime: {
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
				},
			},
		};
	},
};
