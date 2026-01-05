import { createLanguage } from "@flint.fyi/core";
import fsSync from "node:fs";
import type * as ts from "typescript";

import { createTypeScriptJsonFile } from "./createJsonFile.ts";
import type { TSNodesByName } from "./nodes.ts";

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
			prepareFromDisk: (filePathAbsolute) => {
				return {
					file: createTypeScriptJsonFile(
						filePathAbsolute,
						fsSync.readFileSync(filePathAbsolute, "utf8"),
					),
				};
			},
			prepareFromVirtual: (filePathAbsolute, sourceText) => {
				return {
					file: createTypeScriptJsonFile(filePathAbsolute, sourceText),
				};
			},
		};
	},
});
