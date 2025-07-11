import type * as yamlParser from "yaml-unist-parser";

import { createLanguage } from "@flint.fyi/core";
import fsSync from "node:fs";

import { createYamlFile } from "./createYamlFile.js";
import { YmlNodesByName } from "./nodes.js";

export interface YmlServices {
	root: yamlParser.Root;
}

export const ymlLanguage = createLanguage<YmlNodesByName, YmlServices>({
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
