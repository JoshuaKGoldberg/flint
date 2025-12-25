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
		async runRule(rule, options) {
			const reports: NormalizedReport[] = [];

			const context = {
				report: (report: RuleReport) => {
					reports.push({
						...report,
						fix:
							report.fix && !Array.isArray(report.fix)
								? [report.fix]
								: report.fix,
						message: rule.messages[report.message],
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

			const runtime = await rule.setup(context, options);

			if (!runtime?.visitors) {
				return reports;
			}

			const fileServices = { options, root };
			const { visitors } = runtime;

			visit(root, (node) => {
				visitors[node.type]?.(node, fileServices);
			});

			return reports;
		},
	};

	return { languageFile, root };
}
