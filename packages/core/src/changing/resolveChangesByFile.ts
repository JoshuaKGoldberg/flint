import { CachedFactory } from "cached-factory";

import { FileChange } from "../types/changes.js";
import { FileResults } from "../types/linting.js";
import { FileReport } from "../types/reports.js";
import { flatten } from "../utils/arrays.js";
import { createReportSuggestionKey } from "./createReportSuggestionKey.js";
import { resolveChange } from "./resolveChange.js";

export async function resolveChangesByFile(
	filesResults: Map<string, FileResults>,
	requestedSuggestions: Set<string>,
) {
	const changesByFile = new CachedFactory<string, FileChange[]>(() => []);

	function collectReportFix(absoluteFilePath: string, report: FileReport) {
		if (report.fix) {
			changesByFile.get(absoluteFilePath).push(...report.fix);
		}
	}

	async function collectReportSuggestions(
		absoluteFilePath: string,
		report: FileReport,
	) {
		for (const suggestion of report.suggestions ?? []) {
			const key = createReportSuggestionKey(report, suggestion);
			if (requestedSuggestions.has(key)) {
				const resolved = await resolveChange(suggestion, absoluteFilePath);

				for (const change of flatten(resolved)) {
					changesByFile.get(change.filePath).push(change);
				}
			}
		}
	}

	await Promise.all(
		Array.from(filesResults.entries()).map(
			async ([absoluteFilePath, fileResults]) => {
				for (const report of fileResults.reports) {
					collectReportFix(absoluteFilePath, report);
					await collectReportSuggestions(absoluteFilePath, report);
				}
			},
		),
	);

	return Array.from(changesByFile.entries());
}
