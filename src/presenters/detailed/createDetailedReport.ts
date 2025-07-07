import chalk from "chalk";

import { FileRuleReport } from "../../types/reports.js";
import { indenter } from "./constants.js";
import { formatCode } from "./formatCode.js";
import { formatSuggestion } from "./formatSuggestion.js";

export async function* createDetailedReport(
	report: FileRuleReport,
	sourceFileText: string,
) {
	const urlFriendly = `flint.fyi/rules/${report.about.id}`;
	const url = `https://${urlFriendly}`;

	yield indenter;
	yield chalk.hex("ccaaaa")("[");
	yield chalk
		.hex("ff9999")
		.bold(`\u001b]8;;${url}\u0007${report.about.id}\u001b]8;;\u0007`);
	yield chalk.hex("ccaaaa")("]");
	yield " ";
	yield chalk.hex("#eeaa77")(report.message.primary);
	yield `\n${indenter}\n`;

	yield await formatCode(report, sourceFileText);
	yield `\n${indenter}\n`;

	if (report.message.suggestions.length > 1) {
		yield chalk.hex("bbeeff")("Suggestions:");
		yield "\n";
		yield* report.message.suggestions.map((suggestion) =>
			[indenter, chalk.hex("99aacc")(" • "), formatSuggestion(suggestion)].join(
				"",
			),
		);
		yield "\n";
	} else {
		yield indenter;
		yield chalk.hex("bbeeff")("Suggestion: ");
		yield* report.message.suggestions.map(formatSuggestion);
		yield indenter;
		yield "\n";
	}

	yield indenter;
	yield chalk
		.hex("ccbbaa")
		.italic(report.message.secondary.join(`\n${indenter}`));
	yield "\n";

	yield indenter;
	yield chalk
		.hex("aaccaa")
		.italic(`→ \u001b]8;;${url}\u0007${urlFriendly}\u001b]8;;\u0007`);
}
