import { describe, expectTypeOf, it } from "vitest";

import type { Language } from "./languages.js";

import { about, createRule, messages, stateful } from "./rule-builder.js";
import { Rule } from "./rules.js";
import { createRuleRunner } from "./run-rule.js";

interface TestAstNodesByName {
	file: unknown;
}
interface TestServices {
	truthy: true;
}

declare const testLanguage: Language<TestAstNodesByName, TestServices>;

describe("Rule", () => {
	it("should be assignable to AnyRule", async () => {
		const testRule = createRule(testLanguage)
			.pipe(
				about({
					description: "",
					id: "",
				}),
			)
			.pipe(messages({}))
			.pipe(stateful(() => ({})))
			.buildWithVisitors(() => ({}));

		expectTypeOf(testRule).toEqualTypeOf<
			Rule<
				{
					readonly description: "";
					readonly id: "";
				},
				TestAstNodesByName,
				TestServices,
				{},
				never,
				undefined
			>
		>();

		const runRule = createRuleRunner<TestAstNodesByName, TestServices>(
			{ truthy: true },
			() => {},
			() => ({}) as never,
		);

		const testRuleRuntime = testRule.setup(undefined);

		await runRule(testRuleRuntime, {});
	});
});
