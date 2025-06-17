import fsSync from "node:fs";
import * as ts from "typescript";

import { createLanguage } from "../languages/createLanguage.js";
import { createTypeScriptJsonFile } from "./createJsonFile.js";

export interface JsonServices {
	sourceFile: ts.JsonSourceFile;
}

export const json = createLanguage<JsonServices>({
	about: {
		name: "JSON",
	},
	prepare: () => {
		return {
			prepareFileOnDisk: (filePathAbsolute) => {
				return createTypeScriptJsonFile(
					filePathAbsolute,
					fsSync.readFileSync(filePathAbsolute, "utf8"),
				);
			},
			prepareFileVirtually: (filePathAbsolute, sourceText) => {
				return createTypeScriptJsonFile(filePathAbsolute, sourceText);
			},
		};
	},
});
