import type { FileDiskData, LanguageFileDefinition } from "@flint.fyi/core";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import type { MarkdownFileServices } from "./language.ts";
import type { MarkdownNodesByName } from "./nodes.ts";

// Eventually, it might make sense to use a native speed Markdown parser...
// However, the remark ecosystem is quite extensive and well-supported.
// It'll be a while before we can replace it with a native parser.
export function createMarkdownFile(data: FileDiskData) {
	const root = unified().use(remarkParse).parse(data.sourceText);

	const languageFile: LanguageFileDefinition<
		MarkdownNodesByName,
		MarkdownFileServices
	> = {
		about: data,
		runVisitors(options, runtime) {
			if (!runtime.visitors) {
				return;
			}

			const { visitors } = runtime;
			const fileServices = { options, root };

			visit(root, (node) => {
				// @ts-expect-error -- This should work...?
				visitors[node.type]?.(node, fileServices);
			});
		},
	};

	return { languageFile, root };
}
