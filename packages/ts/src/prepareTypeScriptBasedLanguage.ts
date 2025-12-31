import { createProjectService } from "@typescript-eslint/project-service";
import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";
import path from "node:path";
import fs from "node:fs";
import assert from "node:assert/strict";
import * as ts from "typescript";

import { createTypeScriptFileFromProjectService } from "./createTypeScriptFileFromProjectService.js";
import { LinterHost } from "@flint.fyi/core";

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

// https://github.com/nodejs/node/blob/7b7f693a98da060e19f2ec12fb99997d5d5524f9/deps/uv/include/uv.h#L1260-L1269
const UV_DIRENT_TYPE = {
	UV_DIRENT_UNKNOWN: 0,
	UV_DIRENT_FILE: 1,
	UV_DIRENT_DIR: 1,
};

const DirentCtor = fs.Dirent as {
	// https://github.com/nodejs/node/blob/7b7f693a98da060e19f2ec12fb99997d5d5524f9/lib/internal/fs/utils.js#L160
	new (name: string, type: number, parentPath: string): fs.Dirent;
};

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
			readDirectory(directoryPath, extensions, exclude, include, depth) {
				const originalCwd = process.cwd;
				process.cwd = () => host.getCurrentDirectory();
				const originalReadDirSync = fs.readdirSync;
				// @ts-expect-error - TypeScript doesn't understand that the overloads do match up.
				const patchedReaddirSync: typeof fs.readdirSync = (
					readPath,
					options,
				) => {
					assert.deepEqual(
						options,
						{ withFileTypes: true },
						"Flint bug: ts.sys.readDirectory passed unexpected options to fs.readdirSync",
					);
					assert.ok(
						typeof readPath === "string",
						"Flint bug: ts.sys.readDirectory passed unexpected path to fs.readdirSync",
					);
					fs.readdirSync = originalReadDirSync;
					try {
						return host
							.readDirectory(readPath)
							.map(
								(dirent) =>
									new DirentCtor(
										dirent.name,
										dirent.type === "file"
											? UV_DIRENT_TYPE.UV_DIRENT_FILE
											: UV_DIRENT_TYPE.UV_DIRENT_DIR,
										readPath,
									),
							);
					} finally {
						fs.readdirSync = patchedReaddirSync;
					}
				};
				fs.readdirSync = patchedReaddirSync;
				try {
					return ts.sys.readDirectory(
						directoryPath,
						extensions,
						exclude,
						include,
						depth,
					);
				} finally {
					process.cwd = originalCwd;
					fs.readdirSync = originalReadDirSync;
				}
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

	return {
		createFile: (filePathAbsolute) => {
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

			const sourceFile = program.getSourceFile(filePathAbsolute);
			if (!sourceFile) {
				throw new Error(
					`Could not retrieve source file for: ${filePathAbsolute}`,
				);
			}

			return {
				program,
				sourceFile,
				[Symbol.dispose]() {
					service.closeClientFile(filePathAbsolute);
				},
			};
		},
	};
}
