import {
	getColumnAndLineOfPosition,
	LanguageFileDefinition,
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
		normalizeRange: (range) => ({
			begin: getColumnAndLineOfPosition(sourceFileText, range.begin),
			end: getColumnAndLineOfPosition(sourceFileText, range.end),
		}),
		async runRule(runtime, options) {
			const fileServices = { options, root };
			const { visitors } = runtime;

			if (visitors) {
				visit(root, (node) => {
					visitors[node.type]?.(node, fileServices);
				});
			}

			await runtime.teardown?.();
		},
	};

	return { languageFile, root };
}
