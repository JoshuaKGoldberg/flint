import { LanguageFileDefinition } from "@flint/core";
import { debugForFile } from "debug-for-file";
import * as ts from "typescript";

import { createTypeScriptFileFromProgram } from "./createTypeScriptFileFromProgram.js";

const log = debugForFile(import.meta.filename);

export function createTypeScriptFileFromProjectService(
	filePathAbsolute: string,
	program: ts.Program,
	service: ts.server.ProjectService,
): LanguageFileDefinition {
	const sourceFile = program.getSourceFile(filePathAbsolute);
	if (!sourceFile) {
		throw new Error(`Could not retrieve source file for: ${filePathAbsolute}`);
	}

	log("Retrieved source file and type checker for file %s:", filePathAbsolute);

	const file = createTypeScriptFileFromProgram(program, sourceFile);

	return {
		...file,
		[Symbol.dispose]() {
			service.closeClientFile(filePathAbsolute);
		},
	};
}
