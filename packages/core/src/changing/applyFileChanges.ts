import { isTruthy } from "@flint.fyi/utils";
import { debugForFile } from "debug-for-file";
import * as fs from "node:fs/promises";

import { FileResultsWithFixes } from "../types/linting.js";
import { applyChangesToText } from "./applyChangesToText.js";
import { resolveChange } from "./resolveChange.js";

const log = debugForFile(import.meta.filename);

export async function applyFileChanges(
	absoluteFilePath: string,
	requestedSuggestions: Set<string>,
	results: FileResultsWithFixes,
) {
	log("Applying fixes to file: %s", absoluteFilePath);

	const changesByFile = Object.groupBy(
		(
			await Promise.all(
				results.reports
					.flatMap((report) => [
						report.fix,
						...(report.suggestions?.filter((suggestion) =>
							requestedSuggestions.has(`${report.about.id}-${suggestion.id}`),
						) ?? []),
					])
					.filter(isTruthy)
					.flatMap((change) => resolveChange(change, absoluteFilePath)),
			)
		).flat(),
		(change) => change.filePath,
	);

	for (const [changedFilePath, fileChanges] of Object.entries(changesByFile)) {
		const updatedFileContent = applyChangesToText(
			// https://github.com/microsoft/TypeScript/issues/35745#issuecomment-1142580335
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			fileChanges!,
			// TODO: Eventually, the file system should be abstracted
			// Direct fs read calls don't make sense in e.g. virtual file systems
			// https://github.com/JoshuaKGoldberg/flint/issues/73
			await fs.readFile(changedFilePath, "utf8"),
		);

		log(
			"Writing changes to file: %s",
			results.fixableReports.length,
			changedFilePath,
		);

		// TODO: Eventually, the file system should be abstracted
		// Direct fs write calls don't make sense in e.g. virtual file systems
		// https://github.com/JoshuaKGoldberg/flint/issues/73
		await fs.writeFile(changedFilePath, updatedFileContent);

		log("Wrote changes to file: %s", changedFilePath);
	}
}
