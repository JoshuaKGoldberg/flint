import { FileRuleReport } from "@flint.fyi/core";
import chalk from "chalk";

import { colorCodes, indenter } from "./constants.js";
import { formatCode } from "./formatCode.js";
import { formatSuggestion } from "./formatSuggestion.js";
import { wrapIfNeeded } from "./wrapIfNeeded.js";

export async function* createDetailedReport(
	report: FileRuleReport,
	sourceFileText: string,
	width: number,
) {
	const urlFriendly = `flint.fyi/rules/${report.about.id}`;
	const url = `https://${urlFriendly}`;

	yield indenter;
	yield wrapIfNeeded(
		chalk.hex(colorCodes.primaryMessage),
		[
			chalk.hex(colorCodes.ruleBracket)("["),
			chalk
				.hex(colorCodes.reportAboutId)
				.bold(`\u001b]8;;${url}\u0007${report.about.id}\u001b]8;;\u0007`),
			chalk.hex(colorCodes.ruleBracket)("]"),
			" ",
			report.message.primary,
		].join(""),
		width,
	);
	yield `\n${indenter}\n`;

	yield await formatCode(report, sourceFileText);
	yield `\n${indenter}\n`;

	yield indenter;
	yield " ";
	yield wrapIfNeeded(
		chalk.hex(colorCodes.secondaryMessage).italic,
		report.message.secondary.join(`\n`),
		width,
	);
	yield `\n${indenter}\n`;

	if (report.message.suggestions.length > 1) {
		yield indenter;
		yield chalk.hex(colorCodes.suggestionTextHighlight)(" Suggestions:");
		yield "\n";
		yield* report.message.suggestions.map((suggestion) =>
			[
				indenter,
				chalk.hex(colorCodes.suggestionMessage)("  • "),
				formatSuggestion(suggestion),
			].join("\n"),
		);
	} else {
		yield `${indenter} `;
		yield wrapIfNeeded(
			chalk.hex(colorCodes.suggestionTextHighlight),
			`  Suggestion: ${formatSuggestion(report.message.suggestions[0])}`,
			width,
		);
		yield "\n";
	}

	yield `${indenter} `;
	yield chalk
		.hex(colorCodes.ruleUrl)
		.italic(`→ \u001b]8;;${url}\u0007${urlFriendly}\u001b]8;;\u0007`);
}
