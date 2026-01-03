import fs from "node:fs";
import process from "node:process";

let cached: boolean | null = null;

export function isFileSystemCaseSensitive(): boolean {
	if (cached != null) {
		return cached;
	}
	cached = !(
		process.platform === "win32" ||
		fs.existsSync(
			import.meta.filename.slice(0, -1) +
				import.meta.filename.slice(-1).toUpperCase(),
		)
	);
	return cached;
}
