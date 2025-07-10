import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";

import { ConfigRuleDefinition } from "../types/configs.js";
import { AnyLanguage, LanguageFileFactory } from "../types/languages.js";
import { FileRuleReport } from "../types/reports.js";
import { computeRulesWithOptions } from "./computeRulesWithOptions.js";

const log = debugForFile(import.meta.filename);

export function lintFile(
	filePathAbsolute: string,
	languageFactories: CachedFactory<AnyLanguage, LanguageFileFactory>,
	ruleDefinitions: ConfigRuleDefinition[],
) {
	log("Linting: %s:", filePathAbsolute);

	const dependencies = new Set<string>();
	const reports: FileRuleReport[] = [];

	const languageFiles = new CachedFactory((language: AnyLanguage) =>
		languageFactories.get(language).prepareFileOnDisk(filePathAbsolute),
	);
	const rulesWithOptions = computeRulesWithOptions(ruleDefinitions);

	// TODO: It would probably be good to group rules by language...
	for (const [rule, options] of rulesWithOptions) {
		// TODO: How to make types more permissive around assignability?
		// See AnyRule's any
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const file = languageFiles.get(rule.language);

		if (file.cache?.dependencies) {
			for (const dependency of file.cache.dependencies) {
				if (!dependencies.has(dependency)) {
					log("Adding file dependency %s:", dependency);
					dependencies.add(dependency);
				}
			}
		}

		log("Running rule %s with options: %o", rule.about.id, options);
		const ruleReports = file.runRule(rule, options as object | undefined);
		log("Found %d reports from rule %s", ruleReports.length, rule.about.id);

		reports.push(
			...ruleReports.map((report) => ({ about: rule.about, ...report })),
		);
	}

	for (const [language, file] of languageFiles.entries()) {
		log("Disposing language %s file %s", language.about.name, filePathAbsolute);
		file[Symbol.dispose]();
		log("Disposed language %s file %s", language.about.name, filePathAbsolute);
	}

	log("Found %d reports for %s", reports.length, filePathAbsolute);

	return { dependencies, reports };
}
