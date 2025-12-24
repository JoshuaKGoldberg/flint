import { createLanguage } from "@flint.fyi/core";
import fsSync from "node:fs";

import { createTextFile } from "./createTextFile.js";
import { TextFileServices, TextNodes } from "./types.js";

export const textLanguage = createLanguage<TextNodes, TextFileServices>({
	about: {
		name: "YAML",
	},
	prepare: () => {
		return {
			prepareFromDisk: (filePathAbsolute) => {
				return {
					file: createTextFile(
						filePathAbsolute,
						fsSync.readFileSync(filePathAbsolute, "utf8"),
					),
				};
			},
			prepareFromVirtual: (filePathAbsolute, sourceText) => {
				return {
					file: createTextFile(filePathAbsolute, sourceText),
				};
			},
		};
	},
});
