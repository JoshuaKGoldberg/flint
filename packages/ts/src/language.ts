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
		const language = prepareTypeScriptBasedLanguage();

		return {
			prepareFromDisk(data) {
				return prepareTypeScriptFile(
					data,
					language.createFromDisk(data.filePathAbsolute),
				);
			},
			prepareFromVirtual(data) {
				return prepareTypeScriptFile(
					data,
					language.createFromVirtual(data.filePathAbsolute, data.sourceText),
				);
			},
		};
	},
});
