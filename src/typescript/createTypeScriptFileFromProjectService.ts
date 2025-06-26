import { debugForFile } from "debug-for-file";
import * as ts from "typescript";

import { LanguageFileDefinition } from "../types/languages.js";
import { createTypeScriptFileFromProgram } from "./createTypeScriptFileFromProgram.js";

const log = debugForFile(import.meta.filename);

export function createTypeScriptFileFromProjectService(
	filePathAbsolute: string,
	service: ts.server.ProjectService,
): LanguageFileDefinition {
	log("Opening client file:", filePathAbsolute);
	service.openClientFile(filePathAbsolute);

	log("Retrieving client services:", filePathAbsolute);
	const scriptInfo = service.getScriptInfo(filePathAbsolute);
	if (!scriptInfo) {
		throw new Error(`Could not find script info for file: ${filePathAbsolute}`);
	}

	const defaultProject = service.getDefaultProjectForFile(
		scriptInfo.fileName,
		true,
	);
	if (!defaultProject) {
		throw new Error(
			`Could not find default project for file: ${filePathAbsolute}`,
		);
	}

	const program = defaultProject.getLanguageService(true).getProgram();
	if (!program) {
		throw new Error(`Could not retrieve program for file: ${filePathAbsolute}`);
	}

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
