import { debugForFile } from "debug-for-file";
import * as fs from "node:fs/promises";

import { FileChange } from "../types/changes.js";
import { applyChangesToText } from "./applyChangesToText.js";

const log = debugForFile(import.meta.filename);

export async function applyFileChanges(
	absoluteFilePath: string,
	fileChanges: FileChange[],
) {
	log(
		"Collecting %d changes to apply to file: %s",
		fileChanges.length,
		absoluteFilePath,
	);

	const updatedFileContent = applyChangesToText(
		fileChanges,
		// TODO: Eventually, the file system should be abstracted
		// Direct fs read calls don't make sense in e.g. virtual file systems
		// https://github.com/JoshuaKGoldberg/flint/issues/73
		await fs.readFile(absoluteFilePath, "utf8"),
	);

	log("Writing %d changes to file: %s", fileChanges.length, absoluteFilePath);

	// TODO: Eventually, the file system should be abstracted
	// Direct fs write calls don't make sense in e.g. virtual file systems
	// https://github.com/JoshuaKGoldberg/flint/issues/73
	await fs.writeFile(absoluteFilePath, updatedFileContent);

	log("Wrote changes to file: %s", absoluteFilePath);
}
