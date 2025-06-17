import { debugForFile } from "debug-for-file";

import { applyFixes } from "../fixing/applyFixes.js";
import { ConfigDefinition } from "../types/configs.js";
import {
	FileResultsWithFixes,
	RunConfigResultsWithFixes,
} from "../types/linting.js";
import { hasFix } from "../utils/predicates.js";
import { runConfig } from "./runConfig.js";

const log = debugForFile(import.meta.filename);

const maximumIterations = 10;

export async function runConfigFixing(
	config: ConfigDefinition,
): Promise<RunConfigResultsWithFixes> {
	let fixed = new Set<string>();
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
		const { allFilePaths, filesResults } = await runConfig(config);

		// TODO: All these Map and Object creations are probably inefficient...
		const fixableResults = new Map(
			filesResults
				.entries()
				.map(
					([absoluteFilePath, filesResults]): [
						string,
						FileResultsWithFixes,
					] => [
						absoluteFilePath,
						{
							...filesResults,
							fixableReports: filesResults.allReports.filter(hasFix),
						},
					],
				)
				.filter(([, filesResults]) => filesResults.fixableReports.length > 0),
		);

		if (fixableResults.size === 0) {
			log("No fixable reports found, stopping.");
			return { allFilePaths, filesResults, fixed };
		}

		fixed = fixed.union(new Set(fixableResults.keys()));

		await applyFixes(fixableResults);

		if (iteration >= maximumIterations) {
			log("Passed maximum iterations of %d, halting.", maximumIterations);
			return { allFilePaths, filesResults, fixed };
		}
	}
}
