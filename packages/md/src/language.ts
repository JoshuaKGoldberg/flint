import { createLanguage } from "@flint.fyi/core";
import type * as mdast from "mdast";
import fsSync from "node:fs";

import { createMarkdownFile } from "./createMarkdownFile.js";
import { MarkdownNodesByName, WithPosition } from "./nodes.js";
import { prepareMarkdownFile } from "./prepareMarkdownFile.js";

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
			prepareFromDisk: (filePathAbsolute) => {
				const sourceText = fsSync.readFileSync(filePathAbsolute, "utf8");
				const { languageFile, root } = createMarkdownFile(sourceText);

				return prepareMarkdownFile(languageFile, root, sourceText);
			},
			prepareFromVirtual: (filePathAbsolute, sourceText) => {
				const { languageFile, root } = createMarkdownFile(sourceText);

				return prepareMarkdownFile(languageFile, root, sourceText);
			},
		};
	},
});
