import { LanguageFileDefinition } from "@flint.fyi/core";
import ts from "typescript";

import { parseDirectivesFromTypeScriptFile } from "./directives/parseDirectivesFromTypeScriptFile.js";

export function prepareTypeScriptFile(
	languageFile: LanguageFileDefinition,
	sourceFile: ts.SourceFile,
) {
	return {
		...parseDirectivesFromTypeScriptFile(sourceFile),
		file: languageFile,
	};
}
