import {
	getColumnAndLineOfPosition,
	LanguageFileDefinition,
	NormalizedReport,
	RuleReport,
} from "@flint.fyi/core";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

// Eventually, it might make sense to use a native speed Markdown parser...
// However, the remark ecosystem is quite extensive and well-supported.
// It'll be a while before we can replace it with a native parser.
export function createMarkdownFile(sourceText: string) {
	const root = unified().use(remarkParse).parse(sourceText);
	const sourceFileText = { text: sourceText };

	const languageFile: LanguageFileDefinition = {
		async runRule(runtime, messages) {
			const reports: NormalizedReport[] = [];

			const services = {
				root,
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
							begin: getColumnAndLineOfPosition(
								sourceFileText,
								report.range.begin,
							),
							end: getColumnAndLineOfPosition(sourceFileText, report.range.end),
						},
					});
				},
				...(await runtime.fileSetup?.(services)),
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
