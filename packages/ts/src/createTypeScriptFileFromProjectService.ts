import { debugForFile } from "debug-for-file";
import * as ts from "typescript";

import { TypeScriptBasedLanguageFile } from "./language.js";

const log = debugForFile(import.meta.filename);

export function createTypeScriptFileFromProjectService(
	filePathAbsolute: string,
	program: ts.Program,
	service: ts.server.ProjectService,
): TypeScriptBasedLanguageFile {
	const sourceFile = program.getSourceFile(filePathAbsolute);
	if (!sourceFile) {
		throw new Error(`Could not retrieve source file for: ${filePathAbsolute}`);
	}

	log("Retrieved source file and type checker for file %s:", filePathAbsolute);

	return {
		program,
		sourceFile,
		[Symbol.dispose]() {
			service.closeClientFile(filePathAbsolute);
		},
	};
}
