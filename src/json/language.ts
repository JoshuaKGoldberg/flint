import fsSync from "node:fs";
import * as ts from "typescript";

import { createLanguage } from "../languages/createLanguage.js";
import { TSNodesByName } from "../typescript/nodes.js";
import { createTypeScriptJsonFile } from "./createJsonFile.js";

export interface JsonServices {
	sourceFile: ts.JsonSourceFile;
}

// TODO: It would be nice to limit TSNodesByName to just nodes in JSON files...
export const json = createLanguage<TSNodesByName, JsonServices>({
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
