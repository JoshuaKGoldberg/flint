import { createLanguage } from "@flint.fyi/core";
import fsSync from "node:fs";
import * as ts from "typescript";

import { createTypeScriptJsonFile } from "./createJsonFile.js";
import { TSNodesByName } from "./nodes.js";

export interface JsonServices {
	sourceFile: ts.JsonSourceFile;
}

// TODO: It would be nice to limit TSNodesByName to just nodes in JSON files...
export const jsonLanguage = createLanguage<TSNodesByName, JsonServices>({
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
