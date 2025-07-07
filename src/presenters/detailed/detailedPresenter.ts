import chalk from "chalk";

import { Presenter } from "../../types/presenters.js";
import { hasFix } from "../../utils/predicates.js";
import { presentHeader } from "../shared/header.js";
import { presentSummary } from "../shared/summary.js";
import { indenter } from "./constants.js";
import { createDetailedReport } from "./createDetailedReport.js";

export const detailedPresenter: Presenter = {
	about: {
		name: "detailed",
	},
	initialize(context) {
		const counts = { all: 0, files: 0, fixable: 0 };

		return {
			header: presentHeader(context),
			runtime: {
				async *renderFile({ file, reports }) {
					counts.all += reports.length;
					counts.files += 1;
					counts.fixable += reports.filter(hasFix).length;

					yield chalk.gray("\n╭");
					yield chalk.hex("ff7777")("./");
					yield chalk.bold.hex("ff4949")(file.filePath);

					let widest = 16;

					for (const report of reports) {
						yield `\n${indenter}\n`;
						yield* createDetailedReport(report, file.text);

						widest = Math.max(
							widest,
							...[
								report.message.primary,
								...report.message.suggestions,
								...report.message.secondary,
							].map((suggestion) => suggestion.length + 2),
						);
					}

					yield "\n";
					yield chalk.gray(
						`╰${"─".repeat(Math.min(widest, process.stdout.columns - 2))}`,
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
