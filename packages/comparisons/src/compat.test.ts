import { builtinRules } from "eslint/use-at-your-own-risk";
import { describe, expect, it } from "vitest";

import { comparisons } from "./index.ts";
import { groupByLinterAndPlugin } from "./test-util.ts";

const groupedData = groupByLinterAndPlugin(comparisons);

describe("data.json", () => {
	describe("Comparison with ESLint", () => {
		it("includes all builtin rules", () => {
			const builtinESLintRuleNames = new Set<string>(
				// builtinRules is marked as deprecated since it's in "use-at-your-own-risk", not actually deprecated
				// eslint-disable-next-line @typescript-eslint/no-deprecated
				// flint-disable-next-line deprecated
				[...builtinRules]
					.flatMap(([ruleName, module]) =>
						!module.meta?.deprecated ? [ruleName] : [],
					)
					.sort(),
			);

			const builtinESLintRuleNamesCoveredByFlint = new Set(
				Object.keys(groupedData.eslint.builtin).sort(),
			);

			expect(builtinESLintRuleNamesCoveredByFlint).toEqual(
				builtinESLintRuleNames,
			);
		});
	});
});
