import {
	LanguageFileDefinition,
	NormalizedReport,
	RuleReport,
} from "@flint.fyi/core";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";
import { location } from "vfile-location";
import * as yamlParser from "yaml-unist-parser";

// Eventually, it might make sense to use a native speed Yaml parser...
// However, the unist ecosystem is quite extensive and well-supported.
// It'll be a while before we can replace it with a native parser.
export function createYamlFile(filePathAbsolute: string, sourceText: string) {
	const virtualFile = new VFile({
		path: filePathAbsolute,
		value: sourceText,
	});
	const fileLocation = location(virtualFile);
	const root = yamlParser.parse(sourceText);

	const languageFile: LanguageFileDefinition = {
		async runRule(rule, options) {
			const reports: NormalizedReport[] = [];

			const context = {
				report: (report: RuleReport) => {
					// We can assume these always exist.
					/* eslint-disable @typescript-eslint/no-non-null-assertion */
					const positionBegin = fileLocation.toPoint(report.range.begin)!;
					const positionEnd = fileLocation.toPoint(report.range.end)!;
					/* eslint-enable @typescript-eslint/no-non-null-assertion */

					reports.push({
						...report,
						fix:
							report.fix && !Array.isArray(report.fix)
								? [report.fix]
								: report.fix,
						message: rule.messages[report.message],
						range: {
							begin: {
								column: positionBegin.column - 1,
								line: positionBegin.line - 1,
								raw: report.range.begin,
							},
							end: {
								column: positionEnd.column - 1,
								line: positionEnd.line - 1,
								raw: report.range.end,
							},
						},
					});
				},
				root,
			};

			const runtime = await rule.setup(context, options);

			if (!runtime?.visitors) {
				return reports;
			}

			const { visitors } = runtime;

			visit(root, (node) => {
				visitors[node.type]?.(node);
			});

			return reports;
		},
	};

	return { languageFile, root };
}
