import {
	type FileReport,
	formatReport,
	isSuggestionForFiles,
} from "@flint.fyi/core";
import { nullThrows } from "@flint.fyi/utils";
import chalk from "chalk";

import { ColorCodes, indenter } from "./constants.ts";
import { formatCode } from "./formatCode.ts";
import { formatSuggestion } from "./formatSuggestion.ts";
import { wrapIfNeeded } from "./wrapIfNeeded.ts";

export async function* createDetailedReport(
	report: FileReport,
	sourceFileText: string,
	width: number,
) {
	const urlFriendly = `flint.fyi/rules/${report.about.id}`;
	const url = `https://${urlFriendly}`;

	yield indenter;
	yield wrapIfNeeded(
		chalk.hex(ColorCodes.primaryMessage),
		[
			chalk.hex(ColorCodes.ruleBracket)("["),
			chalk
				.hex(ColorCodes.reportAboutId)
				.bold(`\u001b]8;;${url}\u0007${report.about.id}\u001b]8;;\u0007`),
			chalk.hex(ColorCodes.ruleBracket)("]"),
			" ",
			formatReport(report.data, report.message.primary),
		].join(""),
		width,
	);
	yield `\n${indenter}\n`;

	yield await formatCode(report, sourceFileText);
	yield `\n${indenter}\n`;

	yield indenter;
	yield " ";
	yield wrapIfNeeded(
		chalk.hex(ColorCodes.secondaryMessage).italic,
		formatReport(report.data, report.message.secondary.join(`\n`)),
		width,
	);
	yield `\n${indenter}\n`;

	const allSuggestions: string[] = [...report.message.suggestions];

	// Group SuggestionForFile suggestions (e.g., word replacements) into a single suggestion
	const suggestionForFileTexts: string[] = [];
	for (const suggestion of report.suggestions ?? []) {
		if (!isSuggestionForFiles(suggestion)) {
			suggestionForFileTexts.push(suggestion.text);
		}
	}

	if (suggestionForFileTexts.length > 0) {
		const replacements = suggestionForFileTexts.join(", ");
		allSuggestions.push(`Or replace with: ${replacements}`);
	}

	if (allSuggestions.length > 1) {
		yield indenter;
		yield chalk.hex(ColorCodes.suggestionTextHighlight)(" Suggestions:");
		yield "\n";
		yield* allSuggestions.map((suggestion) =>
			[
				indenter,
				chalk.hex(ColorCodes.suggestionMessage)("  • "),
				formatSuggestion(report.data, suggestion),
			].join("\n"),
		);
	} else if (allSuggestions.length === 1) {
		yield `${indenter} `;
		yield wrapIfNeeded(
			chalk.hex(ColorCodes.suggestionTextHighlight),
			`  Suggestion: ${formatSuggestion(report.data, nullThrows(allSuggestions[0], `Report ${report.about.id} message should have at least one suggestion`))}`,
			width,
		);
		yield "\n";
	}

	yield `${indenter} `;
	yield chalk
		.hex(ColorCodes.ruleUrl)
		.italic(`→ \u001b]8;;${url}\u0007${urlFriendly}\u001b]8;;\u0007`);
}
