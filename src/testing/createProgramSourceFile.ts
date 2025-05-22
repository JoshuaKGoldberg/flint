// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
	createFSBackedSystem,
	createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import { CachedFactory } from "cached-factory";
import path from "node:path";
import ts from "typescript";

const projectRoot = path.join(import.meta.dirname, "../..");

const environments = new CachedFactory((fileName: string) => {
	const system = createFSBackedSystem(
		new Map([[fileName, "// ..."]]),
		projectRoot,
		ts,
	);

	return createVirtualTypeScriptEnvironment(system, [fileName], ts, {
		skipLibCheck: true,
		target: ts.ScriptTarget.ESNext,
	});
});

export function createProgramSourceFile(fileName: string, sourceText: string) {
	const environment = environments.get(fileName);
	environment.updateFile(fileName, sourceText);

	const sourceFile = environment.getSourceFile(fileName)!;
	const typeChecker = environment.languageService
		.getProgram()!
		.getTypeChecker();

	return { sourceFile, typeChecker };
}
