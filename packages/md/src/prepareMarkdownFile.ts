import type { LanguageFileDefinition } from "@flint.fyi/core";
import type { Root } from "mdast";

import { parseDirectivesFromMarkdownFile } from "./directives/parseDirectivesFromMarkdownFile.ts";

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
