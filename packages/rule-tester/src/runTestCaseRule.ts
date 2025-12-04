import {
	AnyLanguage,
	AnyOptionalSchema,
	AnyRule,
	InferredObject,
	LanguageFileFactory,
	RuleAbout,
} from "@flint.fyi/core";
import { CachedFactory } from "cached-factory";

import { TestCaseNormalized } from "./normalizeTestCase.js";

export interface TestCaseRuleConfiguration<
	OptionsSchema extends AnyOptionalSchema | undefined,
> {
	options: InferredObject<OptionsSchema>;
	rule: AnyRule<RuleAbout, OptionsSchema>;
}

export async function runTestCaseRule<
	OptionsSchema extends AnyOptionalSchema | undefined,
>(
	fileFactories: CachedFactory<AnyLanguage, LanguageFileFactory>,
	{ options, rule }: TestCaseRuleConfiguration<OptionsSchema>,
	{ code, fileName }: TestCaseNormalized,
) {
	using file = fileFactories
		// TODO: How to make types more permissive around assignability?
		// See AnyRule's any
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		.get(rule.language)
		.prepareFromVirtual(fileName, code).file;

	const runtime = await rule.setup(options);

	return await file.runRule(runtime, rule.messages);
}
