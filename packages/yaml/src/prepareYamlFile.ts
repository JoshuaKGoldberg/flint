import { LanguageFileDefinition } from "@flint.fyi/core";
import * as yamlParser from "yaml-unist-parser";

import type { YamlServices } from "./language.js";
import type { YamlNodesByName } from "./nodes.js";

import { parseDirectivesFromYamlFile } from "./directives/parseDirectivesFromYamlFile.js";

export function prepareYamlFile(
	languageFile: LanguageFileDefinition<YamlNodesByName, YamlServices>,
	root: yamlParser.Root,
	sourceText: string,
) {
	return {
		...parseDirectivesFromYamlFile(root, sourceText),
		file: languageFile,
	};
}
