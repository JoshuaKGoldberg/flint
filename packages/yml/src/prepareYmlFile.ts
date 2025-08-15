import { LanguageFileDefinition } from "@flint.fyi/core";
import * as yamlParser from "yaml-unist-parser";

import { parseDirectivesFromYmlFile } from "./directives/parseDirectivesFromYmlFile.js";

export function prepareYmlFile(
	languageFile: LanguageFileDefinition,
	root: yamlParser.Root,
	sourceText: string,
) {
	return {
		...parseDirectivesFromYmlFile(root, sourceText),
		file: languageFile,
	};
}
