import {
	createLanguage,
	LanguageFileFactoryDefinition,
	LanguagePreparedDefinition,
} from "@flint.fyi/core";
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

export interface TypeScriptServices {
	program: ts.Program;
	sourceFile: ts.SourceFile;
	typeChecker: ts.TypeChecker;
}

export type TypeScriptBasedLanguageFileFactory = (
	program: ts.Program,
	sourceFile: ts.SourceFile,
) => LanguagePreparedDefinition;

export interface TypeScriptBasedLanguageFile extends Partial<Disposable> {
	program: ts.Program;
	sourceFile: ts.SourceFile;
}
export interface TypeScriptBasedLanguageFileFactoryDefinition {
	createFromDisk(filePathAbsolute: string): TypeScriptBasedLanguageFile;
	createFromVirtual(
		filePathAbsolute: string,
		sourceText: string,
	): TypeScriptBasedLanguageFile;
}

export function prepareTypeScriptBasedLanguage(): TypeScriptBasedLanguageFileFactoryDefinition {
	const { service } = createProjectService();
	const seenPrograms = new Set<ts.Program>();

	const environments = new CachedFactory((filePathAbsolute: string) => {
		const system = createFSBackedSystem(
			new Map([[filePathAbsolute, "// ..."]]),
			projectRoot,
			ts,
		);

		return createVirtualTypeScriptEnvironment(system, [filePathAbsolute], ts, {
			skipLibCheck: true,
			target: ts.ScriptTarget.ESNext,
		});
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
		createFromDisk: (filePathAbsolute) => {
			const program = servicePrograms.get(filePathAbsolute);

			seenPrograms.add(program);

			return createTypeScriptFileFromProjectService(
				filePathAbsolute,
				program,
				service,
			);
		},
		createFromVirtual: (filePathAbsolute, sourceText) => {
			const environment = environments.get(filePathAbsolute);
			environment.updateFile(filePathAbsolute, sourceText);
			/* eslint-disable @typescript-eslint/no-non-null-assertion */
			const sourceFile = environment.getSourceFile(filePathAbsolute)!;
			const program = environment.languageService.getProgram()!;
			/* eslint-enable @typescript-eslint/no-non-null-assertion */

			seenPrograms.add(program);

			return {
				program,
				sourceFile,
			};
			// return opts.createTypeScriptFile(program, sourceFile);
		},
	};
}

export const typescriptLanguage = createLanguage<
	TSNodesByName,
	TypeScriptServices
>({
	about: {
		name: "TypeScript",
	},
	prepare: () => {
		const lang = prepareTypeScriptBasedLanguage();

		return {
			prepareFromDisk(filePathAbsolute) {
				return prepareTypeScriptFile(lang.createFromDisk(filePathAbsolute));
			},
			prepareFromVirtual(filePathAbsolute, sourceText) {
				return prepareTypeScriptFile(
					lang.createFromVirtual(filePathAbsolute, sourceText),
				);
			},
		};
	},
});
