import type { FileReport } from "@flint.fyi/core";
import * as shikiCli from "@shikijs/cli";
import chalk from "chalk";
import { styleText } from "node:util";

import { ColorCodes, indenter } from "./constants.ts";

export async function formatCode(report: FileReport, sourceFileText: string) {
	const start = `${report.range.begin.line + 1}:${report.range.begin.column + 1}`;
	const sourceFileLines = sourceFileText.split("\n");
	const source = sourceFileLines
		.slice(report.range.begin.line, report.range.end.line + 1)
		.join("\n");

	const highlighted = (
		await shikiCli.codeToANSI(source, "typescript", "nord")
	).trim();

	const highlightedLines = highlighted.split("\n");

	const leftWidth = `${start} │ `.length;

	return [
		indenter,
		chalk.hex(ColorCodes.codeLineNumbers)(`${start} `.padStart(leftWidth - 2)),
		chalk.gray("│ "),
		highlightedLines.join(styleText("gray", "     │ ")),
		"\n",
		indenter,
		chalk.gray("│ ".padStart(leftWidth)),
		" ".repeat(report.range.begin.column),
		chalk.hex(ColorCodes.codeWarningUnderline)(
			"~".repeat(report.range.end.column - report.range.begin.column),
		),
	].join("");
}
