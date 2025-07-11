import {
	AnyLanguage,
	AnyOptionalSchema,
	AnyRule,
	InferredObject,
	LanguageFileFactory,
	RuleAbout,
} from "@flint.fyi/core";
import { CachedFactory } from "cached-factory";
import assert from "node:assert";

import { createReportSnapshot } from "./createReportSnapshot.js";
import { runTestCaseRule } from "./runTestCaseRule.js";
import { InvalidTestCase, ValidTestCase } from "./types.js";

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
	#fileFactories: CachedFactory<AnyLanguage, LanguageFileFactory>;
	#testerOptions: Required<RuleTesterOptions>;

	constructor({ describe, it, scope = globalThis }: RuleTesterOptions = {}) {
		this.#fileFactories = new CachedFactory((language: AnyLanguage) =>
			language.prepare(),
		);
		this.#testerOptions = {
			describe: defaultTo(describe, scope, "describe"),
			it: defaultTo(it, scope, "it"),
			scope,
		};
	}

	describe<OptionsSchema extends AnyOptionalSchema | undefined>(
		rule: AnyRule<RuleAbout, OptionsSchema>,
		{ invalid, valid }: TestCases<InferredObject<OptionsSchema>>,
	) {
		this.#testerOptions.describe(rule.about.id, () => {
			this.#testerOptions.describe("invalid", () => {
				for (const testCase of invalid) {
					this.#itInvalidCase(rule, testCase);
				}
			});

			this.#testerOptions.describe("valid", () => {
				for (const testCase of valid) {
					this.#itValidCase(rule, testCase);
				}
			});
		});
	}

	#itInvalidCase<OptionsSchema extends AnyOptionalSchema | undefined>(
		rule: AnyRule<RuleAbout, OptionsSchema>,
		testCase: InvalidTestCase<InferredObject<OptionsSchema>>,
	) {
		this.#testerOptions.it(testCase.code, () => {
			const reports = runTestCaseRule(
				this.#fileFactories,
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
		rule: AnyRule<RuleAbout, OptionsSchema>,
		testCaseRaw: ValidTestCase<InferredObject<OptionsSchema>>,
	) {
		const testCase =
			typeof testCaseRaw === "string" ? { code: testCaseRaw } : testCaseRaw;

		this.#testerOptions.it(testCase.code, () => {
			const reports = runTestCaseRule(
				this.#fileFactories,
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
