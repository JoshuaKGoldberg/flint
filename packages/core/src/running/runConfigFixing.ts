import { debugForFile } from "debug-for-file";

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
		const { allFilePaths, filesResults } = await runConfig(configDefinition);

		const appliedChanges = await applyFilesChanges(
			filesResults,
			requestedSuggestions,
		);

		if (!appliedChanges.length) {
			log("No file changes found, stopping.");
			return { allFilePaths, changed, filesResults };
		}

		log("Applied changes to %d files.", appliedChanges.length);

		changed = changed.union(new Set(appliedChanges));

		if (iteration >= maximumIterations) {
			log("Passed maximum iterations of %d, halting.", maximumIterations);
			return { allFilePaths, changed, filesResults };
		}
	}
}
