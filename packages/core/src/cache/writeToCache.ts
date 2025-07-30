import { CachedFactory } from "cached-factory";
import * as fs from "node:fs/promises";
import omitEmpty from "omit-empty";

import { CacheStorage } from "../types/cache.js";
import { RunConfigResults } from "../types/linting.js";
import { cacheFileDirectory, cacheFilePath } from "./constants.js";
import { getFileTouchTime } from "./getFileTouchTime.js";

export async function writeToCache(
	configFileName: string,
	runConfigResults: RunConfigResults,
	withoutFilePaths: string[] = [],
) {
	const fileDependents = new CachedFactory(() => new Set<string>());
	const timestamp = Date.now();

	for (const [filePath, fileResult] of runConfigResults.filesResults) {
		for (const dependency of fileResult.dependencies) {
			fileDependents.get(dependency).add(filePath);
		}
	}

	const storage: CacheStorage = {
		configs: {
			[configFileName]: getFileTouchTime(configFileName),
			"package.json": getFileTouchTime("package.json"),
		},
		files: {
			...Object.fromEntries(
				Array.from(runConfigResults.filesResults).map(
					([filePath, fileResults]) => [
						filePath,
						{
							...omitEmpty({
								dependencies: Array.from(fileResults.dependencies).sort(),
								diagnostics: fileResults.diagnostics,
								reports: fileResults.reports,
							}),
							timestamp,
						},
					],
				),
			),
			...(runConfigResults.cached &&
				Object.fromEntries(
					Array.from(runConfigResults.cached).filter(([filePath]) =>
						runConfigResults.allFilePaths.has(filePath),
					),
				)),
		},
	};

	await fs.mkdir(cacheFileDirectory, { recursive: true });
	await fs.writeFile(cacheFilePath, JSON.stringify(storage, null, "\t"));
}
