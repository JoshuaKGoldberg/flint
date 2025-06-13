import { debugForFile } from "debug-for-file";
import * as fs from "node:fs/promises";

import { FileResultsWithFixes } from "../types/results.js";
import { orderFixesLastToFirstWithoutOverlaps } from "./ordering.js";

const log = debugForFile(import.meta.filename);

export async function applyFileFixes(
	allFileContents: Map<string, string>,
	absoluteFilePath: string,
	results: FileResultsWithFixes,
) {
	log("Applying fixes to file: %s", absoluteFilePath);

	const fixes = orderFixesLastToFirstWithoutOverlaps(
		results.fixableReports.map((report) => report.fix),
	);

	const updatedFileContent = fixes.reduce(
		(updatedFileContent, fix) =>
			updatedFileContent.slice(0, fix.range.begin) +
			fix.text +
			updatedFileContent.slice(fix.range.end),
		results.originalContent,
	);

	// TODO: Eventually, the file system should be abstracted
	// Direct fs write calls don't make sense in e.g. virtual file systems
	// https://github.com/JoshuaKGoldberg/flint/issues/69
	// https://github.com/JoshuaKGoldberg/flint/issues/73
	await fs.writeFile(absoluteFilePath, updatedFileContent);
	allFileContents.set(absoluteFilePath, updatedFileContent);

	log(
		"Writing %d of %d fixes to file: %s",
		fixes.length,
		results.fixableReports.length,
		absoluteFilePath,
	);

	return updatedFileContent;
}
