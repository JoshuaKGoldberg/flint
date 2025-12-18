import {
	AnyLanguage,
	AnyOptionalSchema,
	AnyRule,
	InferredObject,
	LanguageFileFactory,
	RuleAbout,
} from "@flint.fyi/core";
import { CachedFactory } from "cached-factory";

import { assertString } from "./assertions/assertString.js";
import { assertValues } from "./assertions/assertValues.js";
import { createReportsFixed } from "./createReportsFixed.js";
import { createReportsOutput } from "./createReportsOutput.js";
import { normalizeTestCase } from "./normalizeTestCase.js";
import { resolveReportedSuggestions } from "./resolveReportedSuggestions.js";
import { runTestCaseRule } from "./runTestCaseRule.js";
import { InvalidTestCase, TestCase, ValidTestCase } from "./types.js";

export interface RuleTesterOptions {
	defaults?: {
		fileName?: string;
	};
	describe?: TesterSetupDescribe;
	it?: TesterSetupIt;
	only?: TesterSetupIt;
	scope?: Record<string, unknown>;
	skip?: TesterSetupIt;
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

	constructor({
		defaults,
		describe,
		it,
		only,
		scope = globalThis,
		skip,
	}: RuleTesterOptions = {}) {
		this.#fileFactories = new CachedFactory((language: AnyLanguage) =>
			language.prepare(),
		);

		it = defaultTo(it, scope, "it");

		if (!skip && "skip" in it && typeof it.skip === "function") {
			skip = it.skip as TesterSetupIt;
		}
		if (!only && "only" in it && typeof it.only === "function") {
			only = it.only as TesterSetupIt;
		}
		if (!skip) {
			throw new TypeError("RuleTester needs a `skip` function");
		}
		if (!only) {
			throw new TypeError("RuleTester needs a `only` function");
		}

		this.#testerOptions = {
			defaults: defaults ?? {},
			describe: defaultTo(describe, scope, "describe"),
			it,
			only,
			scope,
			skip,
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
		const testCaseNormalized = normalizeTestCase(
			testCase,
			this.#testerOptions.defaults.fileName,
		);

		this.#itTestCase(testCaseNormalized, async () => {
			const reports = await runTestCaseRule(
				this.#fileFactories,
				{
					// TODO: Figure out a way around the type assertion...
					options: testCase.options ?? ({} as InferredObject<OptionsSchema>),
					rule,
				},
				testCaseNormalized,
			);

			const fixed = createReportsFixed(testCase.code, reports);
			if (fixed) {
				if (testCase.output) {
					assertString(fixed, testCase.output);
				} else {
					throw new Error(`Missing "output" property for case with fix.`);
				}
			} else if (testCase.output) {
				throw new Error(`Extraneous "output" property for case without fix.`);
			}

			assertString(
				createReportsOutput(testCase.code, reports),
				testCase.snapshot,
			);

			assertValues(
				resolveReportedSuggestions(reports, testCaseNormalized),
				testCase.suggestions,
			);
		});
	}

	#itTestCase(testCase: TestCase, setup: () => Promise<void>) {
		let test = testCase.only
			? this.#testerOptions.only
			: this.#testerOptions.it;

		if (testCase.skip) {
			if ("skip" in test && typeof test.skip === "function") {
				test = test.skip as TesterSetupIt;
			} else {
				test = this.#testerOptions.skip;
			}
		}

		test(testCase.code, setup);
	}

	#itValidCase<OptionsSchema extends AnyOptionalSchema | undefined>(
		rule: AnyRule<RuleAbout, OptionsSchema>,
		testCaseRaw: ValidTestCase<InferredObject<OptionsSchema>>,
	) {
		const testCase =
			typeof testCaseRaw === "string" ? { code: testCaseRaw } : testCaseRaw;
		const testCaseNormalized = normalizeTestCase(
			testCase,
			this.#testerOptions.defaults.fileName,
		);

		this.#itTestCase(testCaseNormalized, async () => {
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
				assertString(
					createReportsOutput(testCaseNormalized.code, reports),
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
