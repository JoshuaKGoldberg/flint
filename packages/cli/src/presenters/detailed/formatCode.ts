import type { FileReport } from "@flint.fyi/core";
import * as shikiCli from "@shikijs/cli";
import chalk from "chalk";

import { ColorCodes, indenter } from "./constants.ts";

export async function formatCode(report: FileReport, sourceFileText: string) {
	const sourceFileLines = sourceFileText.split("\n");
	const source = sourceFileLines
		.slice(report.range.begin.line, report.range.end.line + 1)
		.join("\n");

	const highlighted = (
		await shikiCli.codeToANSI(source, "typescript", "nord")
	).trim();

	const highlightedLines = highlighted.split("\n");

	const gutter = `${report.range.end.line + 1}:${Math.max(report.range.end.column, report.range.begin.column) + 1}`;
	const gutterWidth = `${gutter} │ `.length;

	const createUnderline = (start: number, end: number) => {
		return [
			indenter,
			chalk.gray("│ ".padStart(gutterWidth)),
			" ".repeat(start),
			chalk.hex(ColorCodes.codeWarningUnderline)(
				"~".repeat(Math.max(end - start, 0)),
			),
		].join("");
	};

	const lines = highlightedLines.map((line, index) => {
		const lineNumber = report.range.begin.line + index + 1;
		const columnNumber = report.range.begin.column + 1;
		const lineNumberStr = `${lineNumber}:${columnNumber}`;

		const parts = [
			indenter,
			chalk.hex(ColorCodes.codeLineNumbers)(
				`${lineNumberStr} `.padStart(gutterWidth - 2),
			),
			chalk.gray("│ "),
			line,
			"\n",
		];

		const originalLine = sourceFileLines[report.range.begin.line + index];

		if (!originalLine || originalLine.trim() === "") {
			return "";
		}

		const isFirstLine = index === 0;
		const isLastLine = index === highlightedLines.length - 1;
		const originalLineLength = originalLine.length;

		if (isFirstLine && isLastLine) {
			parts.push(
				createUnderline(report.range.begin.column, report.range.end.column),
			);
		} else if (isFirstLine) {
			parts.push(
				createUnderline(report.range.begin.column, originalLineLength),
			);
		} else if (isLastLine) {
			parts.push(createUnderline(0, report.range.end.column));
		} else {
			parts.push(createUnderline(0, originalLineLength));
		}

		if (!isLastLine) {
			parts.push("\n");
		}

		return parts.join("");
	});

	return lines.join("");
}
