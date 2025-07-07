import * as shikiCli from "@shikijs/cli";
import chalk from "chalk";
import { highlight } from "cli-highlight";
import { styleText } from "node:util";
import * as shiki from "shiki";

import { FileRuleReport } from "../../types/reports.js";

export async function formatCode(
	report: FileRuleReport,
	sourceFileText: string,
) {
	console.log("Formatting code.");
	const start = `${report.range.begin.line}:${report.range.begin.column}`;
	const source = sourceFileText.slice(
		report.range.begin.raw,
		report.range.end.raw,
	);

	const highlighted = (
		await shikiCli.codeToANSI(source, "typescript", "nord")
	).trim();

	const highlightedLines = highlighted.split("\n");

	return [
		chalk.hex("bbb")(`${start} `.padStart(7)),
		chalk.gray("│ "),
		highlightedLines.join(styleText("gray", "     │ ")),

		// chalk.hex("#dcf")("await "),
		// chalk.hex("#cdf")("process"),
		// chalk.hex("#cdd")("()"),
		// chalk.hex("#aaa")(";"),
		// "\n",
		// chalk.gray("       │ "),
		// chalk.hex("#fcc")("~~~~~~~~~~~~~~~"),
	].join("");
}
