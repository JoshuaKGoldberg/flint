import {
	AnyOptionalSchema,
	InferredObject,
	type Language,
	LanguageFileFactory,
	type Rule,
	RuleAbout,
} from "@flint.fyi/core";
import { CachedFactory } from "cached-factory";

import { TestCaseNormalized } from "./normalizeTestCase.js";

export interface TestCaseRuleConfiguration<
	AstNodesByName,
	ContextServices extends object,
	FileContext extends object,
	OptionsSchema extends AnyOptionalSchema | undefined,
> {
	options: InferredObject<OptionsSchema>;
	rule: Rule<
		RuleAbout,
		AstNodesByName,
		ContextServices,
		FileContext,
		string,
		OptionsSchema
	>;
}

export async function runTestCaseRule<
	AstNodesByName,
	ContextServices extends object,
	FileContext extends object,
	OptionsSchema extends AnyOptionalSchema | undefined,
>(
	fileFactories: CachedFactory<
		Language<AstNodesByName, ContextServices>,
		LanguageFileFactory<AstNodesByName, ContextServices>
	>,
	{
		options,
		rule,
	}: TestCaseRuleConfiguration<
		AstNodesByName,
		ContextServices,
		FileContext,
		OptionsSchema
	>,
	{ code, fileName }: TestCaseNormalized,
) {
	using file = fileFactories
		.get(rule.language)
		.prepareFromVirtual(fileName, code).file;

	const runtime = rule.setup(options);

	return await file.runRule(runtime, rule.messages);
}
