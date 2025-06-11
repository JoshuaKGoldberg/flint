import { createProjectService } from "@typescript-eslint/project-service";
import { debugForFile } from "debug-for-file";
import * as fs from "node:fs/promises";

import {
	ConfigDefinition,
	ConfigRuleDefinition,
	ConfigUseDefinition,
} from "../types/configs.js";
import { FileRuleReport } from "../types/reports.js";
import { makeAbsolute } from "../utils/makeAbsolute.js";
import { lintFile } from "./lintFile.js";
import { readGitignore } from "./readGitignore.js";

const log = debugForFile(import.meta.filename);

interface ConfigUseDefinitionWithFiles extends ConfigUseDefinition {
	files: Set<string>;
	rules: ConfigRuleDefinition[];
}

export async function runConfig(config: ConfigDefinition) {
	const gitignore = await readGitignore();

	log("Collecting files from %d use pattern(s)", config.use.length);
	log("Excluding based on .gitignore: %s", gitignore);

	const useDefinitions: ConfigUseDefinitionWithFiles[] = await Promise.all(
		config.use.map(async (use) => ({
			...use,
			files: new Set(
				await Array.fromAsync(
					fs.glob([use.glob].flat() as string[], {
						exclude: [gitignore, ...(config.ignore ?? [])].flat(),
					}),
				),
			),
			rules: use.rules.flat() as ConfigRuleDefinition[],
		})),
	);

	const allFilePaths = new Set(
		useDefinitions.flatMap((use) => Array.from(use.files)),
	);

	const { service } = createProjectService();
	const allFileReports = new Map<string, FileRuleReport[]>();

	// TODO: This is very slow and the whole thing should be refactored 🙌.
	// The separate lintFile function recomputes rule options repeatedly.
	// It'd be better to group files together in some way.
	for (const filePath of allFilePaths) {
		const fileReports = lintFile(
			makeAbsolute(filePath),
			useDefinitions
				.filter((use) => use.files.has(filePath))
				.flatMap((use) => use.rules),
			service,
		);

		if (fileReports.length) {
			allFileReports.set(filePath, fileReports);
		}
	}

	log("Found %d reports for all files", allFileReports.size);
	return allFileReports;
}
