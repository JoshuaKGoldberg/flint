import { debugForFile } from "debug-for-file";

import { FileResultsWithFixes } from "../types/linting.js";
import { applyFileChanges } from "./applyFileChanges.js";

const log = debugForFile(import.meta.filename);

export async function applyChanges(
	filesResults: Map<string, FileResultsWithFixes>,
	requestedSuggestions: Set<string>,
) {
	log("Applying changes to %d file(s)", filesResults.size);

	await Promise.all(
		filesResults.entries().map(async ([absoluteFilePath, fileResults]) => {
			await applyFileChanges(
				absoluteFilePath,
				requestedSuggestions,
				fileResults,
			);
		}),
	);

	log("Finished applying fixes.");
}
