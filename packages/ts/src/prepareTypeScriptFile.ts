import { parseDirectivesFromTypeScriptFile } from "./directives/parseDirectivesFromTypeScriptFile.js";
import { TypeScriptBasedLanguageFile } from "./language.js";
import { LanguagePreparedDefinition } from "@flint.fyi/core";
import { createTypeScriptFileFromProgram } from "./createTypeScriptFileFromProgram.js";

export function prepareTypeScriptFile(
	file: TypeScriptBasedLanguageFile,
): LanguagePreparedDefinition {
	const { program, sourceFile, [Symbol.dispose]: onDispose } = file;
	return {
		...parseDirectivesFromTypeScriptFile(sourceFile),
		file: {
			...(onDispose != null && { [Symbol.dispose]: onDispose }),
			...createTypeScriptFileFromProgram(program, sourceFile),
		},
	};
}
