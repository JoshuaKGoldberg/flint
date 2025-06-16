import { debugForFile } from "debug-for-file";

import { FileResults } from "../types/results.js";
import { applyFileFixes } from "./applyFileFixes.js";

const log = debugForFile(import.meta.filename);

export async function applyFixes(filesResults: Map<string, FileResults>) {
	log("Applying fixes to %d file(s)", filesResults.size);

	await Promise.all(
		filesResults.entries().map(async ([filePathAbsolute, fileResults]) => {
			await applyFileFixes(filePathAbsolute, fileResults);
		}),
	);

	log("Finished applying fixes.");
}
