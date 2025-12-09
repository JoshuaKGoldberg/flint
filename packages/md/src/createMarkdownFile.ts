import type * as mdast from "mdast";

import {
	createRuleRunner,
	getColumnAndLineOfPosition,
	LanguageFileDefinition,
	RuleContext,
	RuleVisitor,
	RuleVisitors,
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
		runRule: createRuleRunner<MarkdownNodesByName, MarkdownServices>(
			{
				root,
			},
			<MessageId extends string, FileContext extends object>(
				visitors: RuleVisitors<
					MarkdownNodesByName,
					MessageId,
					FileContext & MarkdownServices
				>,
				context: FileContext & MarkdownServices & RuleContext<MessageId>,
			) => {
				visit(root, (node) => {
					const visitor = visitors[node.type] as
						| RuleVisitor<typeof node, MessageId, MarkdownServices>
						| undefined;

					visitor?.(node, context);
				});
			},
			(range) => ({
				begin: getColumnAndLineOfPosition(sourceFileText, range.begin),
				end: getColumnAndLineOfPosition(sourceFileText, range.end),
			}),
		),
	};

	return { languageFile, root };
}
