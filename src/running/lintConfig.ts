import { debugForFile } from "debug-for-file";
import * as fs from "node:fs/promises";

import {
	ConfigDefinition,
	ConfigRuleDefinition,
	ConfigUseDefinition,
} from "../types/configs.js";
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

	const allFiles = new Set(
		useDefinitions.flatMap((use) => Array.from(use.files)),
	);

	// TODO: This is very slow and the whole thing should be refactored 🙌.
	// The separate lintFile function recomputes rule options repeatedly.
	// It'd be better to group files together in some way.
	for (const file of allFiles) {
		await lintFile(
			file,
			useDefinitions
				.filter((use) => use.files.has(file))
				.flatMap((use) => use.rules),
		);
	}
}
