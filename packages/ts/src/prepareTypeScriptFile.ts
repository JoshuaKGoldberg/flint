import { createTypeScriptFileFromProgram } from "./createTypeScriptFileFromProgram.ts";
import { parseDirectivesFromTypeScriptFile } from "./directives/parseDirectivesFromTypeScriptFile.ts";
import type { TypeScriptBasedLanguageFile } from "./prepareTypeScriptBasedLanguage.ts";

export function prepareTypeScriptFile(file: TypeScriptBasedLanguageFile) {
	const { program, sourceFile, [Symbol.dispose]: onDispose } = file;
	return {
		...parseDirectivesFromTypeScriptFile(sourceFile),
		file: {
			...(onDispose != null && { [Symbol.dispose]: onDispose }),
			...createTypeScriptFileFromProgram(program, sourceFile),
		},
	};
}
