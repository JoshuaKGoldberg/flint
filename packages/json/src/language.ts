import { createLanguage } from "@flint.fyi/core";
import fsSync from "node:fs";
import type * as ts from "typescript";

import { createTypeScriptJsonFile } from "./createJsonFile.ts";
import type { JsonNodesByName } from "./nodes.ts";

export interface JsonFileServices {
	sourceFile: ts.JsonSourceFile;
}

// TODO: It would be nice to limit JsonNodesByName to just nodes in JSON files...
export const jsonLanguage = createLanguage<JsonNodesByName, JsonFileServices>({
	about: {
		name: "JSON",
	},
	createFileFactory: () => {
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
