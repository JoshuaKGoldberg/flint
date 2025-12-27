import { createLanguage } from "@flint.fyi/core";
import fsSync from "node:fs";

import { createTextFile } from "./createTextFile.js";
import { TextNodes, TextServices } from "./types.js";

export const textLanguage = createLanguage<TextNodes, TextServices>({
	about: {
		name: "Text",
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
