import { createLanguage } from "@flint.fyi/core";
import { createProjectService } from "@typescript-eslint/project-service";
import {
	createFSBackedSystem,
	createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";
import path from "node:path";
import * as ts from "typescript";

import { createTypeScriptFileFromProgram } from "./createTypeScriptFileFromProgram.js";
import { createTypeScriptFileFromProjectService } from "./createTypeScriptFileFromProjectService.js";
import { TSNodesByName } from "./nodes.js";
import { prepareTypeScriptFile } from "./prepareTypeScriptFile.js";

const log = debugForFile(import.meta.filename);

const projectRoot = path.join(import.meta.dirname, "../..");

export interface TypeScriptFileServices {
	program: ts.Program;
	sourceFile: ts.SourceFile;
	typeChecker: ts.TypeChecker;
}

export const typescriptLanguage = createLanguage<
	TSNodesByName,
	TypeScriptFileServices
>({
	about: {
		name: "TypeScript",
	},
	prepare: () => {
		const { service } = createProjectService();
		const seenPrograms = new Set<ts.Program>();

		const environments = new CachedFactory((filePathAbsolute: string) => {
			const system = createFSBackedSystem(
				new Map([[filePathAbsolute, "// ..."]]),
				projectRoot,
				ts,
			);

			return createVirtualTypeScriptEnvironment(
				system,
				[filePathAbsolute],
				ts,
				{
					skipLibCheck: true,
					target: ts.ScriptTarget.ESNext,
				},
			);
		});

		const servicePrograms = new CachedFactory((filePathAbsolute: string) => {
			log("Opening client file:", filePathAbsolute);
			service.openClientFile(filePathAbsolute);

			log("Retrieving client services:", filePathAbsolute);
			const scriptInfo = service.getScriptInfo(filePathAbsolute);
			if (!scriptInfo) {
				throw new Error(
					`Could not find script info for file: ${filePathAbsolute}`,
				);
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
				throw new Error(
					`Could not retrieve program for file: ${filePathAbsolute}`,
				);
			}

			return program;
		});

		return {
			prepareFromDisk: (filePathAbsolute) => {
				const program = servicePrograms.get(filePathAbsolute);

				seenPrograms.add(program);

				const { languageFile, sourceFile } =
					createTypeScriptFileFromProjectService(
						filePathAbsolute,
						program,
						service,
					);

				return prepareTypeScriptFile(languageFile, sourceFile);
			},
			prepareFromVirtual: (filePathAbsolute, sourceText) => {
				const environment = environments.get(filePathAbsolute);
				environment.updateFile(filePathAbsolute, sourceText);
				/* eslint-disable @typescript-eslint/no-non-null-assertion */
				const sourceFile = environment.getSourceFile(filePathAbsolute)!;
				const program = environment.languageService.getProgram()!;
				/* eslint-enable @typescript-eslint/no-non-null-assertion */

				seenPrograms.add(program);

				const languageFile = createTypeScriptFileFromProgram(
					program,
					sourceFile,
				);

				return prepareTypeScriptFile(languageFile, sourceFile);
			},
		};
	},
});
