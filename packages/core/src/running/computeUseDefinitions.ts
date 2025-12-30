import { makeAbsolute } from "@flint.fyi/utils";
import { debugForFile } from "debug-for-file";
import * as fs from "node:fs/promises";
import path from "node:path";

import {
	ConfigRuleDefinition,
	ConfigUseDefinition,
	ProcessedConfigDefinition,
} from "../types/configs.js";
import { flatten } from "../utils/arrays.js";
import { readGitignore } from "./readGitignore.js";
import { resolveUseFilesGlobs } from "./resolveUseFilesGlobs.js";

const log = debugForFile(import.meta.filename);

export interface ConfigUseDefinitionWithFiles extends ConfigUseDefinition {
	found: Set<string>;
	rules: ConfigRuleDefinition[];
}

export async function computeUseDefinitions(
	configDefinition: ProcessedConfigDefinition,
): Promise<ConfigUseDefinitionWithFiles[]> {
	log("Collecting files from %d use pattern(s)", configDefinition.use.length);

	const gitignore = await readGitignore();

	log("Excluding based on .gitignore: %s", gitignore);

	return await Promise.all(
		configDefinition.use.map(async (use) => {
			const globs = resolveUseFilesGlobs(use.files, configDefinition);

			return {
				...use,
				found: new Set(
					(
						await Array.fromAsync(
							fs.glob([globs.include].flat(), {
								exclude: [...gitignore, ...globs.exclude],
								withFileTypes: true,
							}),
						)
					)
						.filter((entry) => entry.isFile())
						.map((entry) =>
							path.relative(
								process.cwd(),
								makeAbsolute(path.join(entry.parentPath, entry.name)),
							),
						),
				),
				rules: use.rules ? flatten(use.rules) : [],
			};
		}),
	);
}
