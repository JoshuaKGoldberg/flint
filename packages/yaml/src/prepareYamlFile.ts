import type { LanguageFileDefinition } from "@flint.fyi/core";
import type * as yamlParser from "yaml-unist-parser";

import { parseDirectivesFromYamlFile } from "./directives/parseDirectivesFromYamlFile.ts";

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
