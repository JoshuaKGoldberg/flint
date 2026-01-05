import { createLanguage } from "@flint.fyi/core";
import fsSync from "node:fs";

import { createTextFile } from "./createTextFile.ts";
import type { TextFileServices, TextNodes } from "./types.ts";

export const textLanguage = createLanguage<TextNodes, TextFileServices>({
	about: {
		name: "YAML",
	},
	createFileFactory: () => {
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
