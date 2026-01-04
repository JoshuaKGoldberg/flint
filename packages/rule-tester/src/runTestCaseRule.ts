import {
	type AnyLanguage,
	type AnyLanguageFileFactory,
	type AnyOptionalSchema,
	type AnyRule,
	getColumnAndLineOfPosition,
	type InferredObject,
	type NormalizedReport,
	type RuleAbout,
} from "@flint.fyi/core";
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
	fileFactories: CachedFactory<AnyLanguage, AnyLanguageFileFactory>,
	{ options, rule }: Required<TestCaseRuleConfiguration<OptionsSchema>>,
	{ code, fileName }: TestCaseNormalized,
): Promise<NormalizedReport[]> {
	using file = fileFactories
		// TODO: How to make types more permissive around assignability?
		// See AnyRule's any
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		.get(rule.language)
		.prepareFromVirtual({
			filePath: fileName,
			filePathAbsolute: fileName,
			sourceText: code,
		}).file;

	const reports: NormalizedReport[] = [];

	const ruleRuntime = await rule.setup({
		report(ruleReport) {
			reports.push({
				...ruleReport,
				fix:
					ruleReport.fix && !Array.isArray(ruleReport.fix)
						? [ruleReport.fix]
						: ruleReport.fix,
				message: rule.messages[ruleReport.message],
				range: {
					begin: getColumnAndLineOfPosition(
						file.about.sourceText,
						ruleReport.range.begin,
					),
					end: getColumnAndLineOfPosition(
						file.about.sourceText,
						ruleReport.range.end,
					),
				},
			});
		},
	});

	console.log({ ruleRuntime });

	if (ruleRuntime) {
		// TODO: How to make types more permissive around assignability?
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		file.runVisitors(options as InferredObject<OptionsSchema>, ruleRuntime);

		await ruleRuntime.teardown?.();
	}

	return reports;
}
