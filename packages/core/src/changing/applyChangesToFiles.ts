import { debugForFile } from "debug-for-file";

import { FileResults } from "../types/linting.js";
import { applyChangesToFile } from "./applyChangesToFile.js";
import { resolveChangesByFile } from "./resolveChangesByFile.js";

const log = debugForFile(import.meta.filename);

export async function applyChangesToFiles(
	filesResults: Map<string, FileResults>,
	requestedSuggestions: Set<string>,
) {
	log("Resolving changes from results.");

	const changesByFile = await resolveChangesByFile(
		filesResults,
		requestedSuggestions,
	);

	log("Resolved %d changes from results.");

	await Promise.all(
		changesByFile.map(async ([absoluteFilePath, fileChanges]) => {
			await applyChangesToFile(absoluteFilePath, fileChanges);
		}),
	);

	log("Finished applying changes.");

	return changesByFile.map(([key]) => key);
}
