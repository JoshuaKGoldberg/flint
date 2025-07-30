import { writeToCache } from "../cache/writeToCache.js";
import { ProcessedConfigDefinition } from "../types/configs.js";
import { RunConfigResults } from "../types/linting.js";
import { runConfig } from "./runConfig.js";

export async function runConfigAndCache(
	configDefinition: ProcessedConfigDefinition,
): Promise<RunConfigResults> {
	const runConfigResults = await runConfig(configDefinition);

	await writeToCache(configDefinition.filePath, runConfigResults);

	return runConfigResults;
}
