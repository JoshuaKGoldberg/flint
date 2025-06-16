import { debugForFile } from "debug-for-file";
import * as fs from "node:fs/promises";

import { ConfigDefinition, ConfigRuleDefinition } from "../types/configs.js";
import { PluginGlob } from "../types/plugins.js";
import { collectGlobFiles } from "./collectGlobFiles.js";
import { ConfigUseDefinitionWithFiles } from "./collectVirtualFiles.js";
import { readGitignore } from "./readGitignore.js";

const log = debugForFile(import.meta.filename);

export async function collectUseDefinitions(
	config: ConfigDefinition,
): Promise<ConfigUseDefinitionWithFiles[]> {
	const gitignore = await readGitignore();
	log("Collecting files from %d use pattern(s)", config.use.length);
	log("Excluding based on .gitignore: %s", gitignore);

	return await Promise.all(
		config.use.map(async (use) => {
			const globs = [use.glob].flat() as PluginGlob[];
			const languages = new Set(globs.map((glob) => glob.language));

			return {
				...use,
				files: new Set(
					await Array.fromAsync(
						fs.glob(collectGlobFiles(use.glob), {
							exclude: [gitignore, ...(config.ignore ?? [])].flat(),
						}),
					),
				),
				languages,
				rules: use.rules.flat() as ConfigRuleDefinition[],
			};
		}),
	);
}
