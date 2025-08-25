import {
	AnyLanguage,
	AnyOptionalSchema,
	AnyRule,
	RuleAbout,
	InferredObject,
	LanguageFileFactory,
} from "@flint.fyi/core";
import { CachedFactory } from "cached-factory";

import { TestCaseNormalized } from "./normalizeTestCase.js";

export interface TestCaseRuleConfiguration<
	OptionsSchema extends AnyOptionalSchema | undefined,
> {
	options?: InferredObject<OptionsSchema>;
	rule: AnyRule<RuleAbout, OptionsSchema>;
}

export function runTestCaseRule<
	OptionsSchema extends AnyOptionalSchema | undefined,
>(
	fileFactories: CachedFactory<AnyLanguage, LanguageFileFactory>,
	{ options, rule }: Required<TestCaseRuleConfiguration<OptionsSchema>>,
	{ code, fileName }: TestCaseNormalized,
) {
	using file = fileFactories
		// TODO: How to make types more permissive around assignability?
		// See AnyRule's any
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		.get(rule.language)
		.prepareFromVirtual(fileName, code).file;

	return file.runRule(rule, options as InferredObject<OptionsSchema>);
}
