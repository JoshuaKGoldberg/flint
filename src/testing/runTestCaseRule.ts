import { runLintRule } from "../running/runLintRule.js";
import { AnyRuleDefinition } from "../types/rules.js";
import { AnyOptionalSchema, InferredObject } from "../types/shapes.js";
import { createProgramSourceFile } from "./createProgramSourceFile.js";

export interface NormalizedTestCase {
	code: string;
	fileName?: string;
}

export interface TestCaseRuleConfiguration<
	OptionsSchema extends AnyOptionalSchema | undefined,
> {
	options?: InferredObject<OptionsSchema>;
	rule: AnyRuleDefinition<OptionsSchema>;
}

export function runTestCaseRule<
	OptionsSchema extends AnyOptionalSchema | undefined,
>(
	{ options, rule }: Required<TestCaseRuleConfiguration<OptionsSchema>>,
	{ code, fileName = "file.ts" }: NormalizedTestCase,
) {
	const { sourceFile, typeChecker } = createProgramSourceFile(fileName, code);

	return runLintRule(rule, options, sourceFile, typeChecker);
}
