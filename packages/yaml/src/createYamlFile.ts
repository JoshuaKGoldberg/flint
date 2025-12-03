import {
	getColumnAndLineOfPosition,
	LanguageFileDefinition,
	NormalizedReport,
	RuleReport,
} from "@flint.fyi/core";
import { visit } from "unist-util-visit";
import * as yamlParser from "yaml-unist-parser";

// Eventually, it might make sense to use a native speed Yaml parser...
// However, the unist ecosystem is quite extensive and well-supported.
// It'll be a while before we can replace it with a native parser.
export function createYamlFile(sourceText: string) {
	const root = yamlParser.parse(sourceText);
	const sourceFileText = { text: sourceText };

	const languageFile: LanguageFileDefinition = {
		runRule(runtime, messages) {
			const reports: NormalizedReport[] = [];

			const context = {
				report: (report: RuleReport) => {
					reports.push({
						...report,
						fix:
							report.fix && !Array.isArray(report.fix)
								? [report.fix]
								: report.fix,
						message: messages[report.message],
						range: {
							begin: getColumnAndLineOfPosition(
								sourceFileText,
								report.range.begin,
							),
							end: getColumnAndLineOfPosition(sourceFileText, report.range.end),
						},
					});
				},
				root,
			};

			if (!runtime.visitors) {
				return reports;
			}

			const { visitors } = runtime;

			visit(root, (node) => {
				visitors[node.type]?.(node, context);
			});

			return reports;
		},
	};

	return { languageFile, root };
}
