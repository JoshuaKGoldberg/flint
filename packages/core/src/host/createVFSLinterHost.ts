import path from "node:path";
import {
	LinterHost,
	LinterHostDirectoryEntry,
	LinterHostDirectoryWatcher,
	LinterHostFileWatcher,
	LinterHostFileWatcherEvent,
	VFSLinterHost,
} from "../types/host.js";
import { normalizePath } from "./normalizePath.js";

export function createVFSLinterHost(
	cwd: string,
	baseHost?: LinterHost,
): VFSLinterHost {
	cwd = normalizePath(cwd);
	const fileMap = new Map<string, string>();
	const fileWatchers = new Map<string, Set<LinterHostFileWatcher>>();
	const directoryWatchers = new Map<string, Set<LinterHostDirectoryWatcher>>();
	const recursiveDirectoryWatchers = new Map<
		string,
		Set<LinterHostDirectoryWatcher>
	>();
	function watchEvent(
		normalizedFilePathAbsolute: string,
		fileEvent: LinterHostFileWatcherEvent,
	) {
		for (const watcher of fileWatchers.get(normalizedFilePathAbsolute) ?? []) {
			watcher(fileEvent);
		}
		let slashIdx = normalizedFilePathAbsolute.lastIndexOf("/");
		if (slashIdx < 0) {
			return;
		}
		let directoryPathAbsolute = normalizedFilePathAbsolute.slice(0, slashIdx);
		for (const watcher of directoryWatchers.get(directoryPathAbsolute) ?? []) {
			watcher(normalizedFilePathAbsolute);
		}
		do {
			directoryPathAbsolute = directoryPathAbsolute.slice(0, slashIdx);
			for (const watcher of recursiveDirectoryWatchers.get(
				directoryPathAbsolute,
			) ?? []) {
				watcher(normalizedFilePathAbsolute);
			}
		} while ((slashIdx = directoryPathAbsolute.lastIndexOf("/")) >= 0);
	}
	return {
		getCurrentDirectory() {
			return cwd;
		},
		stat(pathAbsolute) {
			pathAbsolute = normalizePath(pathAbsolute);
			for (const filePath of fileMap.keys()) {
				if (pathAbsolute === filePath) {
					return "file";
				}
				if (filePath.startsWith(pathAbsolute + "/")) {
					return "directory";
				}
			}
			return baseHost?.stat(pathAbsolute);
		},
		readFile(filePathAbsolute) {
			filePathAbsolute = normalizePath(filePathAbsolute);
			const file = fileMap.get(filePathAbsolute);
			if (file != null) {
				return file;
			}
			if (baseHost?.stat(filePathAbsolute) === "file") {
				return baseHost.readFile(filePathAbsolute);
			}
			return undefined;
		},
		readDirectory(directoryPathAbsolute) {
			directoryPathAbsolute = normalizePath(directoryPathAbsolute) + "/";
			const result = new Map<string, LinterHostDirectoryEntry>();

			for (let filePath of fileMap.keys()) {
				if (!filePath.startsWith(directoryPathAbsolute)) {
					continue;
				}
				filePath = filePath.slice(directoryPathAbsolute.length);
				const slashIndex = filePath.indexOf("/");
				let dirent: LinterHostDirectoryEntry = {
					type: "file",
					name: filePath,
				};
				if (slashIndex >= 0) {
					dirent = {
						type: "directory",
						name: filePath.slice(0, slashIndex),
					};
				}
				if (!result.get(dirent.name)) {
					result.set(dirent.name, dirent);
				}
			}

			return [
				...result.values(),
				...((baseHost?.stat(directoryPathAbsolute) === "directory" &&
					baseHost.readDirectory(directoryPathAbsolute)) ||
					[]),
			];
		},
		watchFile(filePathAbsolute, callback) {
			filePathAbsolute = normalizePath(filePathAbsolute);
			let watchers = fileWatchers.get(filePathAbsolute);
			if (watchers == null) {
				watchers = new Set();
				fileWatchers.set(filePathAbsolute, watchers);
			}
			watchers.add(callback);
			const baseWatcher = baseHost?.watchFile(filePathAbsolute, callback);
			return {
				[Symbol.dispose]() {
					watchers.delete(callback);
					if (watchers.size === 0) {
						fileWatchers.delete(filePathAbsolute);
					}
					baseWatcher?.[Symbol.dispose]();
				},
			};
		},
		watchDirectory(directoryPathAbsolute, recursive, callback) {
			directoryPathAbsolute = normalizePath(directoryPathAbsolute);
			const collection = recursive
				? recursiveDirectoryWatchers
				: directoryWatchers;
			let watchers = collection.get(directoryPathAbsolute);
			if (watchers == null) {
				watchers = new Set();
				collection.set(directoryPathAbsolute, watchers);
			}
			watchers.add(callback);
			const baseWatcher = baseHost?.watchDirectory(
				directoryPathAbsolute,
				recursive,
				callback,
			);
			return {
				[Symbol.dispose]() {
					watchers.delete(callback);
					if (watchers.size === 0) {
						collection.delete(directoryPathAbsolute);
					}
					baseWatcher?.[Symbol.dispose]();
				},
			};
		},
		vfsUpsertFile(filePathAbsolute, content) {
			filePathAbsolute = normalizePath(filePathAbsolute);
			const fileEvent = fileMap.has(filePathAbsolute) ? "changed" : "created";
			fileMap.set(filePathAbsolute, content);
			watchEvent(filePathAbsolute, fileEvent);
		},
		vfsDeleteFile(filePathAbsolute) {
			filePathAbsolute = normalizePath(filePathAbsolute);
			if (!fileMap.delete(filePathAbsolute)) {
				return;
			}
			watchEvent(filePathAbsolute, "deleted");
		},
		vfsListFiles() {
			return fileMap;
		},
	};
}
