import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";

import { ConfigDefinition } from "../types/configs.js";
import { AnyLanguage } from "../types/languages.js";
import { FileResults, RunConfigResults } from "../types/results.js";
import { hasFix } from "../utils/predicates.js";
import { collectUseDefinitions } from "./collectUseDefinitions.js";
import { collectVirtualFiles } from "./collectVirtualFiles.js";
import { lintFile } from "./lintFile.js";

const log = debugForFile(import.meta.filename);

export async function runConfig(
	config: ConfigDefinition,
): Promise<RunConfigResults> {
	const useDefinitions = await collectUseDefinitions(config);
	const virtualFiles = await collectVirtualFiles(useDefinitions);

	const fileFactories = new CachedFactory((language: AnyLanguage) =>
		language.prepare(),
	);
	const filesResults = new Map<string, FileResults>();
	let totalReports = 0;

	// TODO: This is very slow and the whole thing should be refactored 🙌.
	// The separate lintFile function recomputes rule options repeatedly.
	// It'd be better to group files together in some way.
	// Then, async useDefinitions work could be merged into collectVirtualFiles.
	for (const [filePath, virtualFile] of virtualFiles) {
		const reports = lintFile(
			fileFactories,
			virtualFile.filePathAbsolute,
			useDefinitions
				.filter((use) => use.files.has(filePath))
				.flatMap((use) => use.rules),
		);

		if (!reports.length) {
			continue;
		}

		filesResults.set(filePath, {
			allReports: reports,
			fixableReports: reports.filter(hasFix),
			virtualFile,
		});
		totalReports += reports.length;
	}

	log("Found %d report(s) across %d file(s)", totalReports, filesResults.size);

	return { filesResults };
}
