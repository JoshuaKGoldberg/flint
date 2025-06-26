import { CachedFactory } from "cached-factory";
import * as fs from "node:fs/promises";
import omitEmpty from "omit-empty";

import { CacheStorage } from "../types/cache.js";
import { RunConfigResults } from "../types/linting.js";
import { cacheFileDirectory, cacheFilePath } from "./constants.js";

export async function writeToCache(results: RunConfigResults) {
	const fileDependents = new CachedFactory(() => new Set<string>());
	const timestamp = Date.now();

	for (const [filePath, fileResult] of results.filesResults) {
		for (const dependency of fileResult.dependencies) {
			fileDependents.get(dependency).add(filePath);
		}
	}

	const storage: CacheStorage = {
		files: {
			...Object.fromEntries(
				Array.from(results.filesResults).map(([filePath, fileResults]) => [
					filePath,
					{
						...omitEmpty({
							dependencies: Array.from(fileResults.dependencies).sort(),
							reports: fileResults.reports,
						}),
						timestamp,
					},
				]),
			),
			...(results.cached && Object.fromEntries(results.cached)),
		},
	};

	await fs.mkdir(cacheFileDirectory, { recursive: true });
	await fs.writeFile(cacheFilePath, JSON.stringify(storage, null, "\t"));
}
