import { debugForFile } from "debug-for-file";

import { writeToCache } from "../cache/writeToCache.js";
import { applyFilesChanges } from "../changing/applyFilesChanges.js";
import { ProcessedConfigDefinition } from "../types/configs.js";
import { RunConfigResultsWithChanges } from "../types/linting.js";
import { runConfig } from "./runConfig.js";

const log = debugForFile(import.meta.filename);

const maximumIterations = 10;

export async function runConfigFixing(
	configDefinition: ProcessedConfigDefinition,
	requestedSuggestions: Set<string>,
): Promise<RunConfigResultsWithChanges> {
	let changed = new Set<string>();
	let iteration = 0;

	while (true) {
		iteration += 1;
		log(
			"Starting fix iteration %d of maximum %d",
			iteration,
			maximumIterations,
		);

		// TODO: Investigate reusing file contents from previous iterations.
		// Why read file many time when few do trick?
		// Or, at least it should all be virtual...
		// https://github.com/JoshuaKGoldberg/flint/issues/73
		const runConfigResults = await runConfig(configDefinition);

		log("Applying fixes from file results.");

		const fixedFilePaths = await applyFilesChanges(
			runConfigResults.filesResults,
			requestedSuggestions,
		);

		log("Fixed %d files.", fixedFilePaths.length);

		await writeToCache(configDefinition.filePath, runConfigResults);

		if (!fixedFilePaths.length) {
			log("No file changes found, stopping.");
			return { ...runConfigResults, changed };
		}

		log("Applied changes to %d files.", fixedFilePaths.length);

		changed = changed.union(new Set(fixedFilePaths));

		if (iteration >= maximumIterations) {
			log("Passed maximum iterations of %d, halting.", maximumIterations);
			return { ...runConfigResults, changed };
		}
	}
}
