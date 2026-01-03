import { createLanguage } from "@flint.fyi/core";
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
			prepareFile: (filePathAbsolute, sourceText) => {
				return {
					file: createTypeScriptJsonFile(filePathAbsolute, sourceText),
				};
			},
		};
	},
});
