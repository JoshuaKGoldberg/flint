import type * as mdast from "mdast";

import {
	getColumnAndLineOfPosition,
	LanguageFileDefinition,
	NormalizedReport,
	type ReportMessageData,
	RuleReport,
	type RuleRuntime,
	type RuleVisitor,
} from "@flint.fyi/core";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import type { MarkdownServices } from "./language.js";
import type { MarkdownNodesByName, WithPosition } from "./nodes.js";

// Eventually, it might make sense to use a native speed Markdown parser...
// However, the remark ecosystem is quite extensive and well-supported.
// It'll be a while before we can replace it with a native parser.
export function createMarkdownFile(sourceText: string) {
	const root = unified()
		.use(remarkParse)
		.parse(sourceText) as WithPosition<mdast.Root>;
	const sourceFileText = { text: sourceText };

	const languageFile: LanguageFileDefinition<
		MarkdownNodesByName,
		MarkdownServices
	> = {
		async runRule<MessageId extends string, FileContext extends object>(
			runtime: RuleRuntime<
				MarkdownNodesByName,
				MessageId,
				MarkdownServices,
				FileContext
			>,
			messages: Record<string, ReportMessageData>,
		): Promise<NormalizedReport[]> {
			const reports: NormalizedReport[] = [];

			const services = {
				root,
			};

			if (runtime.skipFile(services)) {
				return reports;
			}

			const fileContext = await runtime.fileSetup(services);
			if (fileContext === false) {
				return [];
			}

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
				...fileContext,
			};

			const { visitors } = runtime;

			visit(root, (node) => {
				const visitor = visitors[node.type] as
					| RuleVisitor<typeof node, MessageId, MarkdownServices>
					| undefined;

				visitor?.(node, context);
			});

			return reports;
		},
	};

	return { languageFile, root };
}
