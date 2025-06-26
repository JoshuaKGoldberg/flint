import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";

import { readFileSafeAsJson } from "../running/readFileSafeAsJson.js";
import { CacheStorage } from "../types/cache.js";
import { cacheFilePath } from "./constants.js";
import { getFileTouchTime } from "./getFileTouchTime.js";

const log = debugForFile(import.meta.filename);

export async function readFromCache(
	allFilePaths: Set<string>,
	configFilePath: string,
) {
	// TODO: Add some kind of validation to cache data
	// https://github.com/JoshuaKGoldberg/flint/issues/114
	const cache = (await readFileSafeAsJson(cacheFilePath)) as
		| CacheStorage
		| undefined;

	if (!cache) {
		log("Linting all %d file path(s) due to lack of cache.", allFilePaths.size);
		return undefined;
	}

	for (const filePath of [configFilePath, "package.json"]) {
		if (!Object.hasOwn(cache.configs, filePath)) {
			log(
				"Linting all %d file path(s) due to no cache of %s",
				allFilePaths.size,
				filePath,
			);
			return undefined;
		}

		const timestampCached = cache.configs[filePath];
		const timestampTouched = getFileTouchTime(filePath);
		if (timestampTouched > timestampCached) {
			log(
				"Linting all %d file path(s) due to %s touch timestamp %d after cache timestamp %d",
				allFilePaths.size,
				filePath,
				timestampTouched,
				timestampCached,
			);
			return undefined;
		}
	}

	const cached = new Map(Object.entries(cache.files));
	const filePathsToLint = new Set<string>();

	// Any files touched since last cache write will need to be re-linted
	for (const filePath of allFilePaths) {
		const timestampCached = cached.get(filePath)?.timestamp;
		if (timestampCached === undefined) {
			log("No cache available for: %s", filePath);
			markAsUncached(filePath);
			continue;
		}

		const timestampTouched = getFileTouchTime(filePath);
		if (timestampTouched > timestampCached) {
			log(
				"Directly invalidating cache for: %s due to touch timestamp %d after cache timestamp %d",
				filePath,
				timestampTouched,
				timestampCached,
			);
			markAsUncached(filePath);
		}
	}

	// We also invalidate the cache for any dependents of changed files.
	// But the cache stores dependencies, so we have to reverse that map now.
	const fileDependents = new CachedFactory(() => new Set<string>());

	for (const [filePath, stored] of cached) {
		if (stored.dependencies) {
			for (const dependency of stored.dependencies) {
				fileDependents.get(dependency).add(filePath);
			}
		}
	}

	const transitivelyCheckedForChanges = new Set<string>();
	const transitivelyImpactedByChanges = Array.from(filePathsToLint);

	for (const filePath of transitivelyImpactedByChanges) {
		const dependents = fileDependents.get(filePath);
		for (const dependent of dependents) {
			if (!transitivelyCheckedForChanges.has(dependent)) {
				log("Transitively invalidating cache for: %s", dependent);
				markAsUncached(dependent);
				transitivelyCheckedForChanges.add(dependent);
				transitivelyImpactedByChanges.push(dependent);
			}
		}
	}

	log(
		"Retrieved from %s: %d file(s) cached out of %d",
		cacheFilePath,
		cached.size,
		allFilePaths.size,
	);
	return cached;

	function markAsUncached(filePath: string) {
		cached.delete(filePath);
		filePathsToLint.add(filePath);
	}
}
