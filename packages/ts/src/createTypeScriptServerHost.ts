import { LinterHost } from "@flint.fyi/core";
import ts from "typescript";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

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

export function createTypeScriptServerHost(
	host: LinterHost,
): ts.server.ServerHost {
	return {
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
			return host.readFile(path.resolve(host.getCurrentDirectory(), filePath));
		},
		directoryExists(directoryPath) {
			return (
				host.stat(path.resolve(host.getCurrentDirectory(), directoryPath)) ===
				"directory"
			);
		},
		fileExists(filePath) {
			return (
				host.stat(path.resolve(host.getCurrentDirectory(), filePath)) === "file"
			);
		},
		readDirectory(directoryPath, extensions, exclude, include, depth) {
			const originalCwd = process.cwd;
			process.cwd = () => host.getCurrentDirectory();
			const originalReadDirSync = fs.readdirSync;
			// @ts-expect-error - TypeScript doesn't understand that the overloads do match up.
			const patchedReaddirSync: typeof fs.readdirSync = (readPath, options) => {
				assert.deepEqual(
					options,
					{ withFileTypes: true },
					"Flint bug: ts.sys.readDirectory passed unexpected options to fs.readdirSync",
				);
				assert.ok(
					typeof readPath === "string",
					"Flint bug: ts.sys.readDirectory passed unexpected path to fs.readdirSync",
				);
				try {
					fs.readdirSync = originalReadDirSync;
					return host
						.readDirectory(path.resolve(host.getCurrentDirectory(), readPath))
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
	};
}
