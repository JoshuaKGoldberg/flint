import type {
	AnyLanguage,
	AnyOptionalSchema,
	AnyRule,
	FileReport,
	InferredObject,
	LanguageFileFactory,
	RuleAbout,
} from "@flint.fyi/core";
import { makeAbsolute } from "@flint.fyi/utils";
import type { CachedFactory } from "cached-factory";

import type { TestCaseNormalized } from "./normalizeTestCase.ts";

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
		.prepareFromVirtual({
			filePath: fileName,
			filePathAbsolute: makeAbsolute(fileName),
			sourceText: code,
		}).file;

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
	await file.runVisitors(ruleRuntime, options as InferredObject<OptionsSchema>);

	return reports;
}
