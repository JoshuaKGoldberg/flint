import process from "node:process";
import fs from "node:fs";

let cached: boolean | null = null;

export function isFileSystemCaseSensitive(): boolean {
	return (cached ??=
		process.platform === "win32"
			? false
			: !fs.existsSync(
					import.meta.filename.slice(0, -1) +
						import.meta.filename.slice(-1).toUpperCase(),
				));
}
