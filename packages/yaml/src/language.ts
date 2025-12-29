import { createLanguage } from "@flint.fyi/core";
import fsSync from "node:fs";
import type * as yamlParser from "yaml-unist-parser";

import { createYamlFile } from "./createYamlFile.js";
import type { YamlNodesByName } from "./nodes.js";
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
