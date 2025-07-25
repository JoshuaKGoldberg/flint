import { debugForFile } from "debug-for-file";

import { FileResultsWithFixes } from "../types/linting.js";
import { applyFileFixes } from "./applyFileFixes.js";

const log = debugForFile(import.meta.filename);

export async function applyFixes(
	filesResults: Map<string, FileResultsWithFixes>,
	requestedSuggestions: Set<string>,
) {
	log("Applying fixes to %d file(s)", filesResults.size);

	await Promise.all(
		filesResults.entries().map(async ([absoluteFilePath, fileResults]) => {
			await applyFileFixes(absoluteFilePath, requestedSuggestions, fileResults);
		}),
	);

	log("Finished applying fixes.");
}
