import { createProjectService } from "@typescript-eslint/project-service";
import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";
import path from "path";
import * as ts from "typescript";

import { createTypeScriptFileFromProjectService } from "./createTypeScriptFileFromProjectService.js";
import { LinterHost } from "@flint.fyi/core";
import { matchFiles } from "./typescriptUtilities.js";

const log = debugForFile(import.meta.filename);

export interface TypeScriptBasedLanguageFile extends Partial<Disposable> {
	program: ts.Program;
	sourceFile: ts.SourceFile;
}

export interface TypeScriptBasedLanguageFileFactoryDefinition {
	createFile(filePathAbsolute: string): TypeScriptBasedLanguageFile;
}

function notImplemented(methodName: string): any {
	throw new Error(
		`Flint bug: ts.System's method '${methodName}' is not implemented.`,
	);
}

export function prepareTypeScriptBasedLanguage(
	host: LinterHost,
): TypeScriptBasedLanguageFileFactoryDefinition {
	const { service } = createProjectService({
		host: {
			...ts.sys,
			args: [],
			write() {
				notImplemented("write");
			},
			writeFile() {
				notImplemented("writeFile");
			},
			createDirectory() {
				notImplemented("createDirectory");
			},
			exit() {
				notImplemented("exit");
			},
			readFile(filePath) {
				return host.readFile(
					path.resolve(host.getCurrentDirectory(), filePath),
				);
			},
			directoryExists(directoryPath) {
				return (
					host.stat(path.resolve(host.getCurrentDirectory(), directoryPath)) ===
					"directory"
				);
			},
			fileExists(filePath) {
				return (
					host.stat(path.resolve(host.getCurrentDirectory(), filePath)) ===
					"file"
				);
			},
			readDirectory(directoryPath, extensions, excludes, includes, depth) {
				return matchFiles(
					directoryPath,
					extensions,
					excludes,
					includes,
					ts.sys.useCaseSensitiveFileNames,
					host.getCurrentDirectory(),
					depth,
					(directoryPath) => {
						const files: string[] = [];
						const directories: string[] = [];
						for (const dirent of host.readDirectory(
							path.resolve(host.getCurrentDirectory(), directoryPath),
						)) {
							if (dirent.type === "file") {
								files.push(dirent.name);
							} else if (dirent.type === "directory") {
								directories.push(dirent.name);
							}
						}
						return { files, directories };
					},
					ts.sys.realpath ?? ((path) => path),
				);
			},
			setImmediate,
			setTimeout,
			clearImmediate,
			clearTimeout,
			watchFile(filePath, callback) {
				const watcher = host.watchFile(
					path.resolve(host.getCurrentDirectory(), filePath),
					(event) => {
						let eventKind: ts.FileWatcherEventKind;
						switch (event) {
							case "created":
								eventKind = ts.FileWatcherEventKind.Created;
								break;
							case "changed":
								eventKind = ts.FileWatcherEventKind.Changed;
								break;
							case "deleted":
								eventKind = ts.FileWatcherEventKind.Deleted;
								break;
						}
						callback(filePath, eventKind);
					},
				);
				return {
					close() {
						watcher[Symbol.dispose]();
					},
				};
			},
			watchDirectory(directoryPath, callback, recursive = false) {
				const watcher = host.watchDirectory(
					path.resolve(host.getCurrentDirectory(), directoryPath),
					recursive,
					(filePathAbsolute) => {
						callback(filePathAbsolute);
					},
				);
				return {
					close() {
						watcher[Symbol.dispose]();
					},
				};
			},
		},
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
		createFile: (filePathAbsolute) => {
			log("Opening client file:", filePathAbsolute);
			service.openClientFile(filePathAbsolute); //, host.readFile(filePathAbsolute))

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

			return createTypeScriptFileFromProjectService(
				filePathAbsolute,
				program,
				service,
			);
		},
	};
}
