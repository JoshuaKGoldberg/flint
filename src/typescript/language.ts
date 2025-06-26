import { createProjectService } from "@typescript-eslint/project-service";
import {
	createFSBackedSystem,
	createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import { CachedFactory } from "cached-factory";
import path from "node:path";
import * as ts from "typescript";

import { createLanguage } from "../languages/createLanguage.js";
import { createTypeScriptFileFromProgram } from "./createTypeScriptFileFromProgram.js";
import { createTypeScriptFileFromProjectService } from "./createTypeScriptFileFromProjectService.js";
import { TSNodesByName } from "./nodes.js";

const projectRoot = path.join(import.meta.dirname, "../..");

export interface TypeScriptServices {
	sourceFile: ts.SourceFile;
	typeChecker: ts.TypeChecker;
}

export const typescript = createLanguage<TSNodesByName, TypeScriptServices>({
	about: {
		name: "TypeScript",
	},
	prepare: () => {
		const { service } = createProjectService();
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

		return {
			prepareFileOnDisk: (filePathAbsolute) => {
				return createTypeScriptFileFromProjectService(
					filePathAbsolute,
					service,
				);
			},
			prepareFileVirtually: (filePathAbsolute, sourceText) => {
				const environment = environments.get(filePathAbsolute);
				environment.updateFile(filePathAbsolute, sourceText);
				/* eslint-disable @typescript-eslint/no-non-null-assertion */
				const sourceFile = environment.getSourceFile(filePathAbsolute)!;
				const typeChecker = environment.languageService
					.getProgram()!
					.getTypeChecker();
				/* eslint-enable @typescript-eslint/no-non-null-assertion */

				return createTypeScriptFileFromProgram(sourceFile, typeChecker);
			},
		};
	},
});
