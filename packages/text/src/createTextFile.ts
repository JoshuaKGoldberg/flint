import type {
	LanguageFileDefinition,
	NormalizedReport,
	RuleReport,
} from "@flint.fyi/core";
import indexToPosition from "index-to-position";

export function createTextFile(
	filePathAbsolute: string,
	sourceText: string,
): LanguageFileDefinition {
	return {
		async runRule(rule, options) {
			const reports: NormalizedReport[] = [];

			const context = {
				filePathAbsolute,
				report: (report: RuleReport) => {
					reports.push({
						...report,
						fix:
							report.fix && !Array.isArray(report.fix)
								? [report.fix]
								: report.fix,
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

			const fileServices = { filePathAbsolute, options, sourceText };
			const runtime = await rule.setup(context, options);

			if (runtime?.visitors) {
				runtime.visitors.file?.(sourceText, fileServices);

				if (runtime.visitors.line) {
					const lines = sourceText.split(/\r\n|\n|\r/);
					for (const line of lines) {
						runtime.visitors.line(line, fileServices);
					}
				}
			}

			await runtime?.teardown?.();

			return reports;
		},
	};
}
