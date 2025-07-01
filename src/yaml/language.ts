import type * as yamlParser from "yaml-unist-parser";

import fsSync from "node:fs";

import { createLanguage } from "../languages/createLanguage.js";
import { createYamlFile } from "./createYamlFile.js";
import { YamlNodesByName } from "./nodes.js";

export interface MarkdownServices {
	root: yamlParser.Root;
}

export const yaml = createLanguage<YamlNodesByName, MarkdownServices>({
	about: {
		name: "YAML",
	},
	prepare: () => {
		return {
			prepareFileOnDisk: (filePathAbsolute) => {
				return createYamlFile(
					filePathAbsolute,
					fsSync.readFileSync(filePathAbsolute, "utf8"),
				);
			},
			prepareFileVirtually: (filePathAbsolute, sourceText) => {
				return createYamlFile(filePathAbsolute, sourceText);
			},
		};
	},
});
