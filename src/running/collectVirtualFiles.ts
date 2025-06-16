import * as fs from "node:fs/promises";

import { VirtualFile } from "../files/VirtualFile.js";
import { ConfigRuleDefinition, ConfigUseDefinition } from "../types/configs.js";
import { AnyLanguage } from "../types/languages.js";
import { makeAbsolute } from "../utils/makeAbsolute.js";

export interface ConfigUseDefinitionWithFiles extends ConfigUseDefinition {
	files: Set<string>;
	languages: Set<AnyLanguage>;
	rules: ConfigRuleDefinition[];
}

export async function collectVirtualFiles(
	useDefinitions: ConfigUseDefinitionWithFiles[],
) {
	const virtualFiles = new Map<string, VirtualFile>();

	await Promise.all(
		useDefinitions.map(async (use) => {
			const filePaths = Array.from(use.files);

			for (const filePath of filePaths) {
				const existingVirtualFile = virtualFiles.get(filePath);
				if (existingVirtualFile) {
					existingVirtualFile.addLanguages(use.languages);
					continue;
				}

				const filePathAbsolute = makeAbsolute(filePath);
				const virtualFile = new VirtualFile(
					filePathAbsolute,
					use.languages,
					// TODO: This duplicates the reading of files in languages themselves.
					// It should eventually be merged into the language file factories,
					// likely providing the result of reading the file to the factories.
					// See investigation work around unifying TypeScript's file systems:
					// https://github.com/JoshuaKGoldberg/flint/issues/73
					await fs.readFile(filePathAbsolute, "utf-8"),
				);

				virtualFiles.set(filePath, virtualFile);
			}
		}),
	);

	return virtualFiles;
}
