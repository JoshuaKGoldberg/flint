import { createTypeScriptFileFromProgram } from "./createTypeScriptFileFromProgram.js";
import { parseDirectivesFromTypeScriptFile } from "./directives/parseDirectivesFromTypeScriptFile.js";
import { TypeScriptBasedLanguageFile } from "./prepareTypeScriptBasedLanguage.js";

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
