import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";

import { ConfigRuleDefinition } from "../types/configs.js";
import { AnyLanguage, LanguageFileFactory } from "../types/languages.js";
import { FileRuleReport } from "../types/reports.js";
import { computeRulesWithOptions } from "./computeRulesWithOptions.js";

const log = debugForFile(import.meta.filename);

export function lintFile(
	fileFactories: CachedFactory<AnyLanguage, LanguageFileFactory>,
	filePathAbsolute: string,
	ruleDefinitions: ConfigRuleDefinition[],
) {
	log("Linting: %s:", filePathAbsolute);

	const allReports: FileRuleReport[] = [];
	const rulesWithOptions = computeRulesWithOptions(ruleDefinitions);

	for (const [rule, options] of rulesWithOptions) {
		// TODO: It would probably be good to group rules by language...
		using file = fileFactories
			// TODO: How to make types more permissive around assignability?
			// See AnyRule's any
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			.get(rule.language)
			.prepareFileOnDisk(filePathAbsolute);

		log("Running rule %s with options: %o", rule.about.id, options);
		const ruleReports = file.runRule(rule, options as object | undefined);
		log("Found %d reports from rule %s", ruleReports.length, rule.about.id);

		allReports.push(
			...ruleReports.map((report) => ({ ruleId: rule.about.id, ...report })),
		);
	}

	log("Found %d reports for %s", allReports.length, filePathAbsolute);

	return allReports;
}
