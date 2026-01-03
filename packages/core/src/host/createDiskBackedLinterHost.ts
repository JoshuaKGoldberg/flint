import fs from "node:fs";
import path from "node:path";
import { LinterHost, LinterHostDirectoryEntry } from "../types/host.js";
import { normalizePath } from "./normalizePath.js";
import { isFileSystemCaseSensitive } from "./isFileSystemCaseSensitive.js";

const ignoredPaths = ["/node_modules", "/.git"];

export function createDiskBackedLinterHost(cwd: string): LinterHost {
	const caseSensitiveFS = isFileSystemCaseSensitive();
	cwd = normalizePath(cwd, caseSensitiveFS);

	function getStat(pathAbsolute: string) {
		try {
			return fs.statSync(pathAbsolute);
		} catch {
			return undefined;
		}
	}

	function getExistingDirectory(startPath: string) {
		let current = startPath;
		while (true) {
			const stat = getStat(current);
			if (stat?.isDirectory()) {
				return current;
			}
			const parent = path.dirname(current);
			if (parent === current) {
				return current; // FS root
			}
			current = parent;
		}
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
			let wasFile = fs.existsSync(filePathAbsolute);

			let unwatch: () => void = wasFile ? watchPresent() : watchMissing();

			function statFileAndEmitIfChanged() {
				const isFileNow = fs.existsSync(filePathAbsolute);
				if (isFileNow) {
					callback(wasFile ? "changed" : "created");
				} else {
					callback("deleted");
				}
				wasFile = isFileNow;
				return isFileNow;
			}

			// fs.watch is more performant than fs.watchFile,
			// we use it when file exists on disk
			function watchPresent() {
				const watcher = fs.watch(
					filePathAbsolute,
					{ persistent: false },
					() => {
						if (statFileAndEmitIfChanged()) {
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
					if (!statFileAndEmitIfChanged()) {
						return;
					}
					fs.unwatchFile(filePathAbsolute, listener);
					unwatch();
					unwatch = watchPresent();
				};
				fs.watchFile(
					filePathAbsolute,
					{ persistent: false, interval: pollingInterval },
					listener,
				);
				return () => fs.unwatchFile(filePathAbsolute, listener);
			}

			return {
				[Symbol.dispose]() {
					unwatch();
				},
			};
		},
		watchDirectory(directoryPathAbsolute, recursive, callback) {
			directoryPathAbsolute = normalizePath(
				directoryPathAbsolute,
				caseSensitiveFS,
			);
			function emitEvent(normalizedFilePath: string) {
				if (normalizedFilePath !== directoryPathAbsolute) {
					let p = normalizedFilePath;
					if (p.startsWith(directoryPathAbsolute + "/")) {
						p = p.slice(directoryPathAbsolute.length);
					}
					for (const ignored of ignoredPaths) {
						if (p.endsWith(ignored) || p.includes(ignored + "/")) {
							return;
						}
					}
				}
				callback(normalizedFilePath);
			}
			let watcher: fs.FSWatcher | undefined;
			const startWatchingDirectory = (watchDir: string) => {
				watcher = fs.watch(
					watchDir,
					{ persistent: true, recursive },
					(_event, filename) => {
						if (watchDir !== directoryPathAbsolute) {
							const nowExists =
								getStat(directoryPathAbsolute)?.isDirectory() ?? false;
							if (nowExists) {
								watcher?.close();
								startWatchingDirectory(directoryPathAbsolute);
								emitEvent(directoryPathAbsolute);
							}
							return;
						}
						if (filename != null) {
							const entryPath = normalizePath(
								path.join(directoryPathAbsolute, filename),
								caseSensitiveFS,
							);
							emitEvent(entryPath);
							return;
						}
						emitEvent(directoryPathAbsolute);
					},
				);
			};

			const watchDir =
				getExistingDirectory(directoryPathAbsolute) ?? directoryPathAbsolute;
			startWatchingDirectory(watchDir);
			return {
				[Symbol.dispose]() {
					watcher?.close();
				},
			};
		},
	};
}
