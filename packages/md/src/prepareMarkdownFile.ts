import { LanguageFileDefinition } from "@flint.fyi/core";
import { Root } from "mdast";

import type { MarkdownServices } from "./language.js";
import type { MarkdownNodesByName } from "./nodes.js";

import { parseDirectivesFromMarkdownFile } from "./directives/parseDirectivesFromMarkdownFile.js";

export function prepareMarkdownFile(
	languageFile: LanguageFileDefinition<MarkdownNodesByName, MarkdownServices>,
	root: Root,
	sourceText: string,
) {
	return {
		...parseDirectivesFromMarkdownFile(root, sourceText),
		file: languageFile,
	};
}
