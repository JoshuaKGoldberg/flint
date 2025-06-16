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
				const virtualFile = new VirtualFile(filePathAbsolute, use.languages);

				virtualFiles.set(filePath, virtualFile);
			}
		}),
	);

	return virtualFiles;
}
