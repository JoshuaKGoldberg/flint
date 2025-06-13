import { debugForFile } from "debug-for-file";

import { FileResultsWithFixes } from "../types/results.js";
import { applyFileFixes } from "./applyFileFixes.js";

const log = debugForFile(import.meta.filename);

export async function applyFixes(
	filesResults: Map<string, FileResultsWithFixes>,
) {
	log("Applying fixes to %d file(s)", filesResults.size);

	await Promise.all(
		filesResults.entries().map(async ([absoluteFilePath, fileResults]) => {
			await applyFileFixes(absoluteFilePath, fileResults);
		}),
	);

	log("Finished applying fixes.");
}
