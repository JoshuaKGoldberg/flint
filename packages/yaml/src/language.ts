import type * as yamlParser from "yaml-unist-parser";

import { createLanguage } from "@flint.fyi/core";
import fsSync from "node:fs";

import { createYamlFile } from "./createYamlFile.js";
import { YamlNodesByName } from "./nodes.js";
import { prepareYamlFile } from "./prepareYamlFile.js";

export interface YamlFileServices {
	root: yamlParser.Root;
}

export const yamlLanguage = createLanguage<YamlNodesByName, YamlFileServices>({
	about: {
		name: "YAML",
	},
	prepare: () => {
		return {
			prepareFromDisk: (filePathAbsolute) => {
				const sourceText = fsSync.readFileSync(filePathAbsolute, "utf8");
				const { languageFile, root } = createYamlFile(sourceText);

				return prepareYamlFile(languageFile, root, sourceText);
			},
			prepareFromVirtual: (filePathAbsolute, sourceText) => {
				const { languageFile, root } = createYamlFile(sourceText);

				return prepareYamlFile(languageFile, root, sourceText);
			},
		};
	},
});
