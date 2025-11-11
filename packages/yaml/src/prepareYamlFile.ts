import { LanguageFileDefinition } from "@flint.fyi/core";
import * as yamlParser from "yaml-unist-parser";

import { parseDirectivesFromYamlFile } from "./directives/parseDirectivesFromYamlFile.js";

export function prepareYamlFile(
	languageFile: LanguageFileDefinition,
	root: yamlParser.Root,
	sourceText: string,
) {
	return {
		...parseDirectivesFromYamlFile(root, sourceText),
		file: languageFile,
	};
}
