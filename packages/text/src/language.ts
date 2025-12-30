import { createLanguage } from "@flint.fyi/core";

import { createTextFile } from "./createTextFile.js";
import { TextNodes, TextServices } from "./types.js";

export const textLanguage = createLanguage<TextNodes, TextServices>({
	about: {
		name: "YAML",
	},
	prepare: () => {
		return {
			prepareFile: (filePathAbsolute, sourceText) => {
				return {
					file: createTextFile(filePathAbsolute, sourceText),
				};
			},
		};
	},
});
