import { createLanguage } from "@flint.fyi/core";
import * as ts from "typescript";

import { TSNodesByName } from "./nodes.js";
import { prepareTypeScriptBasedLanguage } from "./prepareTypeScriptBasedLanguage.js";
import { prepareTypeScriptFile } from "./prepareTypeScriptFile.js";

export interface TypeScriptFileServices {
	program: ts.Program;
	sourceFile: ts.SourceFile;
	typeChecker: ts.TypeChecker;
}

export const typescriptLanguage = createLanguage<
	TSNodesByName,
	TypeScriptFileServices
>({
	about: {
		name: "TypeScript",
	},
	prepare: () => {
		const lang = prepareTypeScriptBasedLanguage();

		return {
			prepareFromDisk(filePathAbsolute) {
				return prepareTypeScriptFile(lang.createFromDisk(filePathAbsolute));
			},
			prepareFromVirtual(filePathAbsolute, sourceText) {
				return prepareTypeScriptFile(
					lang.createFromVirtual(filePathAbsolute, sourceText),
				);
			},
		};
	},
});
