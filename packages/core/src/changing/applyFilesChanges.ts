import { debugForFile } from "debug-for-file";

import { FileResults } from "../types/linting.js";
import { applyFileChanges } from "./applyFileChanges.js";
import { resolveChangesByFile } from "./resolveChangesByFile.js";

const log = debugForFile(import.meta.filename);

export async function applyFilesChanges(
	filesResults: Map<string, FileResults>,
	requestedSuggestions: Set<string>,
) {
	log("Resolving changes from results.");

	const changesByFile = await resolveChangesByFile(
		filesResults,
		requestedSuggestions,
	);

	console.log("in applyFilesChanges", changesByFile);

	log("Resolved %d changes from results.");

	await Promise.all(
		changesByFile.map(async ([absoluteFilePath, fileChanges]) => {
			await applyFileChanges(absoluteFilePath, fileChanges);
		}),
	);

	log("Finished applying changes.");

	console.log("changesByFile", changesByFile);
	return changesByFile.map(([key]) => key);
}
