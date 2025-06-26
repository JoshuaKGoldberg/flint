import { FileRuleReport } from "./reports.js";

export interface CacheStorage {
	configs: Record<string, number>;
	files: Record<string, FileCacheStorage>;
}

export interface FileCacheImpacts {
	// TODO: also include dependents. (i.e. global type augmentations)
	// https://github.com/JoshuaKGoldberg/flint/issues/116
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
