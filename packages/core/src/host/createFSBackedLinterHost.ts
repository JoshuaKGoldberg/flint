import fs from "node:fs";
import path from "node:path";
import { LinterHost, LinterHostDirectoryEntry } from "../types/host.js";
import { normalizePath } from "./normalizePath.js";

export function createFSBackedLinterHost(cwd: string): LinterHost {
	cwd = normalizePath(cwd);

	return {
		getCurrentDirectory() {
			return cwd;
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
		// TODO
		watchFile(filePathAbsolute, callback) {
			return {
				[Symbol.dispose]() {},
			};
		},
		watchDirectory(directoryPathAbsolute, recursive, callback) {
			return {
				[Symbol.dispose]() {},
			};
		},
	};
}
