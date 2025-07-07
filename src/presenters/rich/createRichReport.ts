import chalk from "chalk";

import { FileRuleReport } from "../../types/reports.js";
import { formatCode } from "./formatCode.js";
import { formatSuggestion } from "./formatSuggestion.js";

console.log("hi.");
export async function createRichReport(
	report: FileRuleReport,
	sourceFileText: string,
) {
	return [
		chalk.hex("ccaaaa")("["),
		chalk
			.hex("ff9999")
			.bold(
				`\u001b]8;;http://flint.fyi\u0007${report.about.id}\u001b]8;;\u0007`,
			),
		chalk.hex("ccaaaa")("]"),
		" ",
		chalk.hex("#eeaa77")(report.message.primary),
		"\n\n",
		await formatCode(report, sourceFileText),
		"\n\n",
		chalk.hex("bbeeff")("Suggestions:"),
		"\n",
		...report.message.suggestions.map(formatSuggestion),
		"\n",
		chalk.hex("ccbbaa").italic(report.message.secondary.join("\n")),
		"\n",
		chalk.hex("ddccbb").italic("→ "),
		chalk
			.hex("aaccaa")
			.italic(
				`\u001b]8;;https://flint.fyi/${report.about.id}\u0007flint.fyi/${report.about.id}\u001b]8;;\u0007`,
			),
	].join("");
}
