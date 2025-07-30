import {
	LanguageFileDefinition,
	NormalizedRuleReport,
	RuleReport,
} from "@flint.fyi/core";
import indexToPosition from "index-to-position";

export function createTextFile(
	filePathAbsolute: string,
	sourceText: string,
): LanguageFileDefinition {
	return {
		async runRule(rule, options) {
			const reports: NormalizedRuleReport[] = [];

			const context = {
				filePathAbsolute,
				report: (report: RuleReport) => {
					reports.push({
						...report,
						message: rule.messages[report.message],
						range: {
							begin: {
								...indexToPosition(sourceText, report.range.begin),
								raw: report.range.begin,
							},
							end: {
								...indexToPosition(sourceText, report.range.end),
								raw: report.range.end,
							},
						},
					});
				},
				sourceText,
			};

			const runtime = await rule.setup(context, options);

			if (runtime?.visitors) {
				runtime.visitors.file?.(sourceText);

				if (runtime.visitors.line) {
					const lines = sourceText.split(/\r\n|\n|\r/);
					for (const line of lines) {
						runtime.visitors.line(line);
					}
				}
			}

			return reports;
		},
	};
}
