import chalk from "chalk";

import { Presenter } from "../../types/presenters.js";
import { hasFix } from "../../utils/predicates.js";
import { presentHeader } from "../shared/header.js";
import { presentSummary } from "../shared/summary.js";
import { indenter } from "./constants.js";
import { createDetailedReport } from "./createDetailedReport.js";
import { wrapIfNeeded } from "./wrapIfNeeded.js";

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

					const width = process.stdout.columns - indenter.length;

					yield chalk.gray("\n╭");
					yield chalk.hex("ff7777")("./");
					yield* wrapIfNeeded(chalk.bold.hex("ff4949"), file.filePath, width);

					let widest = 16;

					for (const report of reports) {
						yield `\n${indenter}\n`;
						yield* createDetailedReport(report, file.text, width);

						widest = Math.max(
							widest,
							...[
								report.message.primary,
								...report.message.suggestions,
								...report.message.secondary,
							].map((suggestion) => suggestion.length + 3),
						);
					}

					yield `\n${indenter}\n`;
					yield chalk.gray(`╰${"─".repeat(Math.min(widest, width))}`);
					yield "\n";
				},
				*summarize(summaryContext) {
					yield* presentSummary(counts, summaryContext);
				},
			},
		};
	},
};
