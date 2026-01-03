import fs from "node:fs";
import path from "node:path";
import {
	LinterHost,
	LinterHostDirectoryEntry,
	LinterHostFileWatcherEvent,
} from "../types/host.js";
import { normalizePath } from "./normalizePath.js";
import { isFileSystemCaseSensitive } from "./isFileSystemCaseSensitive.js";

const ignoredPaths = ["/node_modules", "/.git"];

export function createDiskBackedLinterHost(cwd: string): LinterHost {
	const caseSensitiveFS = isFileSystemCaseSensitive();
	cwd = normalizePath(cwd, caseSensitiveFS);

	function createWatcher(
		normalizedWatchPath: string,
		recursive: boolean,
		pollingInterval: number,
		callback: (
			normalizedChangedFilePath: string | null,
			event: LinterHostFileWatcherEvent,
		) => void,
	): Disposable {
		const normalizedWatchBasename = normalizedWatchPath.slice(
			normalizedWatchPath.lastIndexOf("/") + 1,
		);
		let exists = fs.existsSync(normalizedWatchPath);
		let unwatch: () => void = exists ? watchPresent() : watchMissing();

		function statAndEmitIfChanged(
			changedFileName: string | null,
			existsNow: boolean | null = null,
		) {
			if (changedFileName != null) {
				changedFileName = normalizePath(changedFileName, caseSensitiveFS);
			}
			existsNow ??= fs.existsSync(normalizedWatchPath);
			if (existsNow) {
				callback(changedFileName, exists ? "changed" : "created");
			} else {
				callback(changedFileName, "deleted");
			}
			exists = existsNow;
			return exists;
		}

		// fs.watch is more performant than fs.watchFile,
		// we use it when file exists on disk
		function watchPresent() {
			const watcher = fs.watch(
				normalizedWatchPath,
				{ persistent: false, recursive },
				(event, filename) => {
					if (filename === normalizedWatchBasename) {
						let changedPath = normalizedWatchPath;
						// /foo/bar is a directory
						// /foo/bar/bar is a file
						// fs.watch('/foo/bar')
						// /foo/bar/bar deleted -> filename === bar
						// /foo/bar deleted -> filename === bar
						if (
							fs
								.statSync(normalizedWatchPath, { throwIfNoEntry: false })
								?.isDirectory()
						) {
							changedPath = normalizePath(
								path.join(normalizedWatchPath, filename),
								caseSensitiveFS,
							);
						}
						if (statAndEmitIfChanged(changedPath)) {
							return;
						}
					} else if (
						statAndEmitIfChanged(
							filename == null
								? null
								: normalizePath(
										path.join(normalizedWatchPath, filename),
										caseSensitiveFS,
									),
						)
					) {
						return;
					}
					watcher.close();
					unwatch();
					unwatch = watchMissing();
				},
			);
			return () => watcher.close();
		}

		// fs.watchFile uses polling and therefore is less performant,
		// we fallback to it when the file doesn't exist on disk
		function watchMissing() {
			const listener: fs.StatsListener = (curr, prev) => {
				if (curr.mtimeMs === prev.mtimeMs || curr.mtimeMs === 0) {
					return;
				}
				if (!statAndEmitIfChanged(normalizedWatchPath)) {
					return;
				}
				fs.unwatchFile(normalizedWatchPath, listener);
				unwatch();
				unwatch = watchPresent();
			};
			fs.watchFile(
				normalizedWatchPath,
				{ persistent: false, interval: pollingInterval },
				listener,
			);
			return () => fs.unwatchFile(normalizedWatchPath, listener);
		}
		return {
			[Symbol.dispose]() {
				unwatch();
			},
		};
	}

	return {
		getCurrentDirectory() {
			return cwd;
		},
		isCaseSensitiveFS() {
			return caseSensitiveFS;
		},
		stat(pathAbsolute) {
			try {
				const stat = fs.statSync(pathAbsolute);
				if (stat.isDirectory()) {
					return "directory";
				}
				if (stat.isFile()) {
					return "file";
				}
			} catch {}
			return undefined;
		},
		readDirectory(directoryPathAbsolute) {
			const result: LinterHostDirectoryEntry[] = [];
			const dirents = fs.readdirSync(directoryPathAbsolute, {
				withFileTypes: true,
			});

			for (let entry of dirents) {
				let stat = entry as Pick<typeof entry, "isFile" | "isDirectory">;
				if (entry.isSymbolicLink()) {
					try {
						stat = fs.statSync(path.join(directoryPathAbsolute, entry.name));
					} catch {
						continue;
					}
				}
				if (stat.isDirectory()) {
					result.push({ type: "directory", name: entry.name });
				}
				if (stat.isFile()) {
					result.push({ type: "file", name: entry.name });
				}
			}

			return result;
		},
		readFile(filePathAbsolute) {
			return fs.readFileSync(filePathAbsolute, "utf8");
		},
		watchFile(filePathAbsolute, callback, pollingInterval = 2_000) {
			filePathAbsolute = normalizePath(filePathAbsolute, caseSensitiveFS);

			return createWatcher(
				filePathAbsolute,
				false,
				pollingInterval,
				(normalizedChangedFilePath, event) => {
					if (normalizedChangedFilePath === filePathAbsolute) {
						callback(event);
					}
				},
			);
		},
		watchDirectory(
			directoryPathAbsolute,
			recursive,
			callback,
			pollingInterval = 2_000,
		) {
			directoryPathAbsolute = normalizePath(
				directoryPathAbsolute,
				caseSensitiveFS,
			);

			return createWatcher(
				directoryPathAbsolute,
				recursive,
				pollingInterval,
				(normalizedChangedFilePath) => {
					normalizedChangedFilePath ??= directoryPathAbsolute;
					if (normalizedChangedFilePath !== directoryPathAbsolute) {
						let p = normalizedChangedFilePath;
						if (p.startsWith(directoryPathAbsolute + "/")) {
							p = p.slice(directoryPathAbsolute.length);
						}
						for (const ignored of ignoredPaths) {
							if (p.endsWith(ignored) || p.includes(ignored + "/")) {
								return;
							}
						}
					}
					callback(normalizedChangedFilePath);
				},
			);
			// let wasDirectory =
			// 	getStat(directoryPathAbsolute)?.isDirectory() ?? false;
			// let unwatch: () => void = wasDirectory ? watchPresent() : watchMissing();
			//
			// function statDirectoryAndEmitIfChanged() {
			// 	const isDirectoryNow =
			// 		getStat(directoryPathAbsolute)?.isDirectory() ?? false;
			// 	if (isDirectoryNow !== wasDirectory) {
			// 		emitEvent(directoryPathAbsolute);
			// 	}
			// 	wasDirectory = isDirectoryNow;
			// 	return isDirectoryNow;
			// }
			//
			// function watchPresent() {
			// 	const watcher = fs.watch(
			// 		directoryPathAbsolute,
			// 		{ persistent: true, recursive },
			// 		(_event, filename) => {
			// 			if (!statDirectoryAndEmitIfChanged()) {
			// 				watcher.close();
			// 				unwatch();
			// 				unwatch = watchMissing();
			// 				return;
			// 			}
			// 			if (filename != null) {
			// 				const entryPath = normalizePath(
			// 					path.join(directoryPathAbsolute, filename),
			// 					caseSensitiveFS,
			// 				);
			// 				emitEvent(entryPath);
			// 				return;
			// 			}
			// 			emitEvent(directoryPathAbsolute);
			// 		},
			// 	);
			// 	return () => watcher.close();
			// }
			//
			// function watchMissing() {
			// 	const listener: fs.StatsListener = (curr, prev) => {
			// 		if (curr.mtimeMs === prev.mtimeMs || curr.mtimeMs === 0) {
			// 			return;
			// 		}
			// 		if (!statDirectoryAndEmitIfChanged()) {
			// 			return;
			// 		}
			// 		fs.unwatchFile(directoryPathAbsolute, listener);
			// 		unwatch();
			// 		unwatch = watchPresent();
			// 	};
			// 	fs.watchFile(
			// 		directoryPathAbsolute,
			// 		{ persistent: false, interval: pollingInterval },
			// 		listener,
			// 	);
			// 	return () => fs.unwatchFile(directoryPathAbsolute, listener);
			// }
			//
			// return {
			// 	[Symbol.dispose]() {
			// 		unwatch();
			// 	},
			// };
		},
	};
}
