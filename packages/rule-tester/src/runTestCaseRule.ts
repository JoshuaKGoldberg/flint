import { CachedFactory } from "cached-factory";

import {
	AnyLanguage,
	LanguageFileFactory,
} from "../../core/src/types/languages.js";
import { AnyRule, RuleAbout } from "../../core/src/types/rules.js";
import {
	AnyOptionalSchema,
	InferredObject,
} from "../../core/src/types/shapes.js";

export interface NormalizedTestCase {
	code: string;
	fileName?: string;
}

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
	{ code, fileName = "file.ts" }: NormalizedTestCase,
) {
	using file = fileFactories
		// TODO: How to make types more permissive around assignability?
		// See AnyRule's any

		.get(rule.language)
		.prepareFileVirtually(fileName, code);

	return file.runRule(rule, options as InferredObject<OptionsSchema>);
}
