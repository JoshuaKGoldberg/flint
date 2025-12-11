import { LanguageFileDefinition } from "@flint.fyi/core";
import ts from "typescript";

import type { TypeScriptServices } from "./language.js";
import type { TSNodesByName } from "./nodes.js";

import { parseDirectivesFromTypeScriptFile } from "./directives/parseDirectivesFromTypeScriptFile.js";

export function prepareTypeScriptFile(
	languageFile: LanguageFileDefinition<TSNodesByName, TypeScriptServices>,
	sourceFile: ts.SourceFile,
) {
	return {
		...parseDirectivesFromTypeScriptFile(sourceFile),
		file: languageFile,
	};
}
