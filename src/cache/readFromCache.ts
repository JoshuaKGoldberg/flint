import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";

import { readFileSafeAsJson } from "../running/readFileSafeAsJson.js";
import { CacheStorage } from "../types/cache.js";
import { cacheFilePath } from "./constants.js";
import { getFileTouchTime } from "./getFileTouchTime.js";

const log = debugForFile(import.meta.filename);

export async function readFromCache(allFilePaths: Set<string>) {
	// TODO: Add some kind of validation to cache data
	const cache = (await readFileSafeAsJson(cacheFilePath)) as
		| CacheStorage
		| undefined;

	if (!cache) {
		log("Linting all %d file path(s) due to lack of cache.", allFilePaths.size);
		return undefined;
	}

	// TODO: Also re-lint if config has changed (include config in cache)

	const cached = new Map(Object.entries(cache.files));
	const filePathsToLint = new Set<string>();

	// Any files touched since last cache write will need to be re-linted
	for (const filePath of allFilePaths) {
		const cacheTimestamp = cached.get(filePath)?.timestamp;
		if (cacheTimestamp === undefined) {
			log("No cache available for: %s", filePath);
			markAsUncached(filePath);
			continue;
		}

		const touchTimeActual = getFileTouchTime(filePath);
		if (touchTimeActual > cacheTimestamp) {
			log(
				"Directly invalidating cache for: %s due to touch timestamp %d after cache timestamp %d",
				filePath,
				touchTimeActual,
				cacheTimestamp,
			);
			markAsUncached(filePath);
		}
	}

	// We also invalidate the cache for any dependents of changed files.
	// But the cache stores dependencies, so we have to reverse that map now.
	// TODO: Investigate whether writing, not reading, should take this on?
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
