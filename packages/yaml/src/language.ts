import type * as yamlParser from "yaml-unist-parser";

import { createLanguage } from "@flint.fyi/core";

import { createYamlFile } from "./createYamlFile.js";
import { YamlNodesByName } from "./nodes.js";
import { prepareYamlFile } from "./prepareYamlFile.js";

export interface YamlServices {
	root: yamlParser.Root;
}

export const yamlLanguage = createLanguage<YamlNodesByName, YamlServices>({
	about: {
		name: "YAML",
	},
	prepare: () => {
		return {
			prepareFile: (filePathAbsolute, sourceText) => {
				const { languageFile, root } = createYamlFile(sourceText);

				return prepareYamlFile(languageFile, root, sourceText);
			},
		};
	},
});
