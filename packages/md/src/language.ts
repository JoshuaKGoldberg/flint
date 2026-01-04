import { createLanguage } from "@flint.fyi/core";
import type * as mdast from "mdast";
import fsSync from "node:fs";

import { createMarkdownFile } from "./createMarkdownFile.ts";
import type { MarkdownNodesByName, WithPosition } from "./nodes.ts";
import { prepareMarkdownFile } from "./prepareMarkdownFile.ts";

export interface MarkdownServices {
	root: WithPosition<mdast.Root>;
}

export const markdownLanguage = createLanguage<
	MarkdownNodesByName,
	MarkdownServices
>({
	about: {
		name: "Markdown",
	},
	prepare: () => {
		return {
			prepareFromDisk: ({ filePathAbsolute }) => {
				const sourceText = fsSync.readFileSync(filePathAbsolute, "utf8");
				const { languageFile, root } = createMarkdownFile(sourceText);

				return prepareMarkdownFile(languageFile, root, sourceText);
			},
			prepareFromVirtual: ({ sourceText }) => {
				const { languageFile, root } = createMarkdownFile(sourceText);

				return prepareMarkdownFile(languageFile, root, sourceText);
			},
		};
	},
});
