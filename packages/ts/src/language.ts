import { createLanguage } from "@flint.fyi/core";
import type * as ts from "typescript";

import type { TypeScriptNodesByName } from "./nodes.ts";
import { prepareTypeScriptBasedLanguage } from "./prepareTypeScriptBasedLanguage.ts";
import { prepareTypeScriptFile } from "./prepareTypeScriptFile.ts";

export interface TypeScriptFileServices {
	program: ts.Program;
	sourceFile: ts.SourceFile;
	typeChecker: ts.TypeChecker;
}

export const typescriptLanguage = createLanguage<
	TypeScriptNodesByName,
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
