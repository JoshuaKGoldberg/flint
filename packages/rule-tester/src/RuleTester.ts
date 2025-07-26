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
import { normalizeTestCase } from "./normalizeTestCase.js";
import { resolveReportedSuggestions } from "./resolveReportedSuggestions.js";
import { runTestCaseRule } from "./runTestCaseRule.js";
import { InvalidTestCase, ValidTestCase } from "./types.js";

export interface RuleTesterOptions {
	describe?: TesterSetupDescribe;
	it?: TesterSetupIt;
	scope?: Record<string, unknown>;
}

export interface TestCases<Options extends object | undefined> {
	invalid: InvalidTestCase<Options>[];
	valid: ValidTestCase<Options>[];
}

export type TesterSetupDescribe = (
	description: string,
	setup: () => void,
) => void;

export type TesterSetupIt = (
	description: string,
	setup: () => Promise<void>,
) => void;

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
		const testCaseNormalized = normalizeTestCase(testCase);

		this.#testerOptions.it(testCase.code, async () => {
			const reports = await runTestCaseRule(
				this.#fileFactories,
				{
					// TODO: Figure out a way around the type assertion...
					options: (testCase.options ?? {}) as InferredObject<OptionsSchema>,
					rule,
				},
				testCaseNormalized,
			);
			const actualSnapshot = createReportSnapshot(testCase.code, reports);

			assert.equal(actualSnapshot, testCase.snapshot);

			const actualSuggestions = resolveReportedSuggestions(
				reports,
				testCaseNormalized,
			);
			assert.deepStrictEqual(actualSuggestions, testCase.suggestions);
		});
	}

	#itValidCase<OptionsSchema extends AnyOptionalSchema | undefined>(
		rule: AnyRule<RuleAbout, OptionsSchema>,
		testCaseRaw: ValidTestCase<InferredObject<OptionsSchema>>,
	) {
		const testCase =
			typeof testCaseRaw === "string" ? { code: testCaseRaw } : testCaseRaw;
		const testCaseNormalized = normalizeTestCase(testCase);

		this.#testerOptions.it(testCase.code, async () => {
			const reports = await runTestCaseRule(
				this.#fileFactories,
				{
					// TODO: Figure out a way around the type assertion...
					options: (testCase.options ?? {}) as InferredObject<OptionsSchema>,
					rule,
				},
				testCaseNormalized,
			);

			if (reports.length) {
				assert.deepStrictEqual(
					createReportSnapshot(testCaseNormalized.code, reports),
					testCaseNormalized.code,
				);
			}
		});
	}
}

function defaultTo<TesterSetup extends TesterSetupDescribe | TesterSetupIt>(
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
