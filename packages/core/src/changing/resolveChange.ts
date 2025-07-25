import * as fs from "node:fs/promises";

import {
	Change,
	ResolvedChange,
	SuggestionForFiles,
} from "../types/changes.js";

export async function resolveChange(
	change: Change,
	sourceFilePath: string,
): Promise<ResolvedChange | ResolvedChange[]> {
	if (!isSuggestionForFiles(change)) {
		return {
			...change,
			filePath: sourceFilePath,
		};
	}

	return (
		await Promise.all(
			Object.entries(change.generators).flatMap(
				async ([filePath, generator]) => {
					// TODO: Eventually, the file system should be abstracted
					// Direct fs write calls don't make sense in e.g. virtual file systems
					// https://github.com/JoshuaKGoldberg/flint/issues/73
					const fileChanges = generator(await fs.readFile(filePath, "utf8"));

					return fileChanges.map((fileChange) => ({
						filePath,
						...fileChange,
					}));
				},
			),
		)
	).flat();
}

function isSuggestionForFiles(change: Change): change is SuggestionForFiles {
	return "generators" in change;
}
