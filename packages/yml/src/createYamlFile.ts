import {
	LanguageFileDefinition,
	NormalizedRuleReport,
	RuleReport,
} from "@flint/core";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";
import { location } from "vfile-location";
import * as yamlParser from "yaml-unist-parser";

// Eventually, it might make sense to use a native speed Yaml parser...
// However, the unist ecosystem is quite extensive and well-supported.
// It'll be a while before we can replace it with a native parser.
export function createYamlFile(
	filePathAbsolute: string,
	sourceText: string,
): LanguageFileDefinition {
	const virtualFile = new VFile({
		path: filePathAbsolute,
		value: sourceText,
	});
	const fileLocation = location(virtualFile);
	const root = yamlParser.parse(sourceText);

	return {
		runRule(rule, options) {
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

			const visitors = rule.setup(context, options);

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
