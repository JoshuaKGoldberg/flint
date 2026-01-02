import { builtinRules } from "eslint/use-at-your-own-risk";
import { describe, expect, it } from "vitest";

import { comparisons } from "./index.js";
import { groupByLinterAndPlugin } from "./test-util.js";

const builtinESLintRuleNames = new Set<string>(
	// builtinRules is marked as deprecated since it's in "use-at-your-own-risk", not actually deprecated
	// eslint-disable-next-line @typescript-eslint/no-deprecated
	[...builtinRules]
		.flatMap(([ruleName, module]) =>
			!module.meta?.deprecated ? [ruleName] : [],
		)
		.sort(),
);

describe("data.json", () => {
	const groupedData = groupByLinterAndPlugin(comparisons);

	describe("Comparison to ESLint", () => {
		it("includes all builtin rules", () => {
			const comparedBuiltinRuleNames = new Set(
				Object.keys(groupedData.eslint.builtin).sort(),
			);

			expect(comparedBuiltinRuleNames).toEqual(builtinESLintRuleNames);
		});
	});
});
