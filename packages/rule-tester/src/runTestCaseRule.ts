import {
	AnyLanguage,
	AnyOptionalSchema,
	AnyRule,
	FileReport,
	InferredObject,
	LanguageFileFactory,
	RuleAbout,
} from "@flint.fyi/core";
import { CachedFactory } from "cached-factory";

import { TestCaseNormalized } from "./normalizeTestCase.js";

export interface TestCaseRuleConfiguration<
	OptionsSchema extends AnyOptionalSchema | undefined,
> {
	options?: InferredObject<OptionsSchema>;
	rule: AnyRule<RuleAbout, OptionsSchema>;
}

export async function runTestCaseRule<
	OptionsSchema extends AnyOptionalSchema | undefined,
>(
	fileFactories: CachedFactory<AnyLanguage, LanguageFileFactory>,
	{ options, rule }: Required<TestCaseRuleConfiguration<OptionsSchema>>,
	{ code, fileName }: TestCaseNormalized,
) {
	const reports: FileReport[] = [];

	using file = fileFactories
		// TODO: How to make types more permissive around assignability?
		// See AnyRule's any
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		.get(rule.language)
		.prepareFromVirtual(fileName, code).file;

	const ruleRuntime = await rule.setup({
		report(ruleReport) {
			reports.push({
				...ruleReport,
				about: rule.about,
				fix:
					ruleReport.fix && !Array.isArray(ruleReport.fix)
						? [ruleReport.fix]
						: ruleReport.fix,
				message: rule.messages[ruleReport.message],
				range: file.normalizeRange(ruleReport.range),
			});
		},
	});

	// TODO: How to make types more permissive around assignability?
	// See AnyRuleRuntime's any
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	await file.runRule(ruleRuntime, options as InferredObject<OptionsSchema>);

	return reports;
}
