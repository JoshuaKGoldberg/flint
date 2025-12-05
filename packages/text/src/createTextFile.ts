import {
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
		async runRule(runtime, messages) {
			const reports: NormalizedReport[] = [];

			const services = {
				filePathAbsolute,
				sourceText,
			};

			const context = {
				...services,
				report: (report: RuleReport) => {
					reports.push({
						...report,
						fix:
							report.fix && !Array.isArray(report.fix)
								? [report.fix]
								: report.fix,
						message: messages[report.message],
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
				...(await runtime.fileSetup?.(services)),
			};

			if (runtime.visitors) {
				runtime.visitors.file?.(sourceText, context);

				if (runtime.visitors.line) {
					const lines = sourceText.split(/\r\n|\n|\r/);
					for (const line of lines) {
						runtime.visitors.line(line, context);
					}
				}
			}

			return reports;
		},
	};
}
