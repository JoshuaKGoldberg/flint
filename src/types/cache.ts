import { FileRuleReport } from "./reports.js";

export interface CacheStorage {
	files: Record<string, FileCacheStorage>;
}

// NOTE: these will need to be filled out by the runner
// Rules may report only a small number of these
// but getFilePathsToLint will need to know all actual dependencies
// So, writing the cache to disk needs to include these
// It can be shallow (1 level). A<-B<-C means A has ["B"], not ["B", "C"]
export interface FileCacheImpacts {
	// TODO: also include dependents. (i.e. global type augmentations)
	dependencies?: string[];
}

export interface FileCacheStorage extends FileCacheImpacts {
	/**
	 * Reports from the last time the file was linted.
	 */
	reports?: FileRuleReport[];

	/**
	 * Unix milliseconds (`Date.now()`) of the last time the file was linted.
	 */
	timestamp: number;
}
