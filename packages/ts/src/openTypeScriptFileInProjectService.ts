import { debugForFile } from "debug-for-file";
import ts from "typescript";

const log = debugForFile(import.meta.filename);

export interface DisposableTypeScriptFile extends Disposable {
	program: ts.Program;
	sourceFile: ts.SourceFile;
}

export function openTypeScriptFileInProjectService(
	service: ts.server.ProjectService,
	filePathAbsolute: string,
): DisposableTypeScriptFile {
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

	return {
		program,
		sourceFile,
		[Symbol.dispose]() {
			service.closeClientFile(filePathAbsolute);
		},
	};
}
