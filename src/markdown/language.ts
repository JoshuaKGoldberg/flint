import type * as mdast from "mdast";

import fsSync from "node:fs";

import { createLanguage } from "../languages/createLanguage.js";
import { createMarkdownFile } from "./createMarkdownFile.js";
import { MarkdownNodesByName, WithPosition } from "./nodes.js";

export interface MarkdownServices {
	root: WithPosition<mdast.Root>;
}

export const markdown = createLanguage<MarkdownNodesByName, MarkdownServices>({
	about: {
		name: "Markdown",
	},
	prepare: () => {
		return {
			prepareFileOnDisk: (filePathAbsolute) => {
				return createMarkdownFile(
					filePathAbsolute,
					fsSync.readFileSync(filePathAbsolute, "utf8"),
				);
			},
			prepareFileVirtually: (filePathAbsolute, sourceText) => {
				return createMarkdownFile(filePathAbsolute, sourceText);
			},
		};
	},
});
