import { FilesComputer, FilesGlobObject } from "../types/files.js";
import { flatten } from "../utils/arrays.js";
import { collectFilesValues } from "./collectFilesValues.js";

export const all: FilesComputer = (config): FilesGlobObject => {
	const exclude = new Set<string>();
	const include = new Set<string>();

	for (const definition of config.use) {
		if (definition.files) {
			collectFilesValues(flatten(definition.files), exclude, include);
		}
	}

	return {
		exclude: Array.from(exclude),
		include: Array.from(include),
	};
};
