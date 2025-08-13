import { LanguageFileDefinition } from "@flint.fyi/core";
import { Root } from "mdast";

import { parseDirectivesFromMarkdownFile } from "./directives/parseDirectivesFromMarkdownFile.js";

export function prepareMarkdownFile(
	languageFile: LanguageFileDefinition,
	root: Root,
	sourceText: string,
) {
	return {
		...parseDirectivesFromMarkdownFile(root, sourceText),
		file: languageFile,
	};
}
