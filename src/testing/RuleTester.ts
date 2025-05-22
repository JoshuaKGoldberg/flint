import assert from "node:assert";

import { AnyRuleDefinition } from "../types/rules.js";
import { AnyOptionalSchema, InferredObject } from "../types/shapes.js";
import { InvalidTestCase, ValidTestCase } from "../types/testing.js";
import { createReportSnapshot } from "./createReportSnapshot.js";
import { runTestCaseRule } from "./runTestCaseRule.js";

export interface RuleTesterOptions {
	describe?: TesterSetup;
	it?: TesterSetup;
	scope?: Record<string, unknown>;
}

export interface TestCases<Options extends object | undefined> {
	invalid: InvalidTestCase<Options>[];
	valid: ValidTestCase<Options>[];
}

export type TesterSetup = (description: string, setup: () => void) => void;

export class RuleTester {
	#describe: TesterSetup;
	#it: TesterSetup;

	constructor({ describe, it, scope = globalThis }: RuleTesterOptions = {}) {
		this.#describe = defaultTo(describe, scope, "describe");
		this.#it = defaultTo(it, scope, "it");
	}

	describe<OptionsSchema extends AnyOptionalSchema | undefined>(
		rule: AnyRuleDefinition<OptionsSchema>,
		{ invalid, valid }: TestCases<InferredObject<OptionsSchema>>,
	) {
		this.#describe(rule.about.id, () => {
			this.#describe("invalid", () => {
				for (const testCase of invalid) {
					this.#itInvalidCase(rule, testCase);
				}
			});

			this.#describe("valid", () => {
				for (const testCase of valid) {
					this.#itValidCase(rule, testCase);
				}
			});
		});
	}

	#itInvalidCase<OptionsSchema extends AnyOptionalSchema | undefined>(
		rule: AnyRuleDefinition<OptionsSchema>,
		testCase: InvalidTestCase<InferredObject<OptionsSchema>>,
	) {
		this.#it(testCase.code, () => {
			const reports = runTestCaseRule(
				{
					// TODO: Figure out a way around the type assertion...
					options: (testCase.options ?? {}) as InferredObject<OptionsSchema>,
					rule,
				},
				testCase,
			);
			const actual = createReportSnapshot(testCase.code, reports);

			assert.equal(actual, testCase.snapshot);
		});
	}

	#itValidCase<OptionsSchema extends AnyOptionalSchema | undefined>(
		rule: AnyRuleDefinition<OptionsSchema>,
		testCaseRaw: ValidTestCase<InferredObject<OptionsSchema>>,
	) {
		const testCase =
			typeof testCaseRaw === "string" ? { code: testCaseRaw } : testCaseRaw;

		this.#it(testCase.code, () => {
			const reports = runTestCaseRule(
				{
					// TODO: Figure out a way around the type assertion...
					options: (testCase.options ?? {}) as InferredObject<OptionsSchema>,
					rule,
				},
				testCase,
			);

			if (reports.length) {
				assert.deepStrictEqual(
					createReportSnapshot(testCase.code, reports),
					testCase.code,
				);
			}
		});
	}
}

function defaultTo(
	provided: TesterSetup | undefined,
	scope: Record<string, unknown>,
	scopeKey: string,
): TesterSetup {
	if (provided) {
		return provided;
	}

	if (scopeKey in scope && typeof scope[scopeKey] === "function") {
		return scope[scopeKey] as TesterSetup;
	}

	throw new Error(`No ${scopeKey} function found`);
}
