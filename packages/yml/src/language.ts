import type * as yamlParser from "yaml-unist-parser";

import { createLanguage } from "@flint.fyi/core";
import fsSync from "node:fs";

import { createYmlFile } from "./createYmlFile.js";
import { YmlNodesByName } from "./nodes.js";
import { prepareYmlFile } from "./prepareYmlFile.js";

export interface YmlServices {
	root: yamlParser.Root;
}

export const ymlLanguage = createLanguage<YmlNodesByName, YmlServices>({
	about: {
		name: "YAML",
	},
	prepare: () => {
		return {
			prepareFromDisk: (filePathAbsolute) => {
				const sourceText = fsSync.readFileSync(filePathAbsolute, "utf8");
				const { languageFile, root } = createYmlFile(
					filePathAbsolute,
					sourceText,
				);

				return prepareYmlFile(languageFile, root, sourceText);
			},
			prepareFromVirtual: (filePathAbsolute, sourceText) => {
				const { languageFile, root } = createYmlFile(
					filePathAbsolute,
					sourceText,
				);

				return prepareYmlFile(languageFile, root, sourceText);
			},
		};
	},
});
