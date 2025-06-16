import { debugForFile } from "debug-for-file";

import { applyFixes } from "../fixing/applyFixes.js";
import { ConfigDefinition } from "../types/configs.js";
import { RunConfigResultsWithFixes } from "../types/results.js";
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

		const { filesResults } = await runConfig(config);

		// TODO: All these Map creations are probably inefficient...
		const fixableResults = new Map(
			filesResults
				.entries()
				.filter(([, fileResults]) => fileResults.fixableReports.length > 0),
		);

		if (fixableResults.size === 0) {
			log("No fixable reports found, stopping.");
			return { filesResults, fixed };
		}

		fixed = fixed.union(new Set(fixableResults.keys()));

		await applyFixes(fixableResults);

		if (iteration >= maximumIterations) {
			log("Passed maximum iterations of %d, halting.", maximumIterations);
			return { filesResults, fixed };
		}
	}
}
