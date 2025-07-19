import { createLanguage } from "@flint.fyi/core";
import fsSync from "node:fs";

import { createTextFile } from "./createTextFile.js";
import { TextNodes, TextServices } from "./types.js";

export const textLanguage = createLanguage<TextNodes, TextServices>({
	about: {
		name: "YAML",
	},
	prepare: () => {
		return {
			prepareFileOnDisk: (filePathAbsolute) => {
				return createTextFile(
					filePathAbsolute,
					fsSync.readFileSync(filePathAbsolute, "utf8"),
				);
			},
			prepareFileVirtually: (filePathAbsolute, sourceText) => {
				return createTextFile(filePathAbsolute, sourceText);
			},
		};
	},
});
