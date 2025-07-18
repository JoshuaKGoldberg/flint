import {
	LanguageFileDefinition,
	NormalizedRuleReport,
	RuleReport,
} from "@flint.fyi/core";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";
import { location } from "vfile-location";

// Eventually, it might make sense to use a native speed Markdown parser...
// However, the remark ecosystem is quite extensive and well-supported.
// It'll be a while before we can replace it with a native parser.
export function createMarkdownFile(
	filePathAbsolute: string,
	sourceText: string,
): LanguageFileDefinition {
	const virtualFile = new VFile({
		path: filePathAbsolute,
		value: sourceText,
	});
	const fileLocation = location(virtualFile);
	const root = unified().use(remarkParse).parse(virtualFile);

	return {
		async runRule(rule, options) {
			const reports: NormalizedRuleReport[] = [];

			const context = {
				report: (report: RuleReport) => {
					// We can assume these always exist.
					/* eslint-disable @typescript-eslint/no-non-null-assertion */
					const positionBegin = fileLocation.toPoint(report.range.begin)!;
					const positionEnd = fileLocation.toPoint(report.range.end)!;
					/* eslint-enable @typescript-eslint/no-non-null-assertion */

					reports.push({
						...report,
						message: rule.messages[report.message],
						range: {
							begin: {
								column: positionBegin.column,
								line: positionEnd.line,
								raw: report.range.begin,
							},
							end: {
								column: positionEnd.column,
								line: positionEnd.line,
								raw: report.range.end,
							},
						},
					});
				},
				root,
			};

			const visitors = await rule.setup(context, options);

			if (!visitors) {
				return reports;
			}

			visit(root, (node) => {
				visitors[node.type]?.(node);
			});

			return reports;
		},
	};
}
