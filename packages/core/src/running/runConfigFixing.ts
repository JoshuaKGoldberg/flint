import { debugForFile } from "debug-for-file";

import { applyChangesToFiles } from "../changing/applyChangesToFiles.js";
import { ProcessedConfigDefinition } from "../types/configs.js";
import { RunConfigResultsWithChanges } from "../types/linting.js";
import { runConfigOnce } from "./runConfigOnce.js";

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
		const runConfigResults = await runConfigOnce(configDefinition);

		log("Applying fixes from file results.");

		const fixedFilePaths = await applyChangesToFiles(
			runConfigResults.filesResults,
			requestedSuggestions,
		);

		log("Fixed %d files.", fixedFilePaths.length);

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
