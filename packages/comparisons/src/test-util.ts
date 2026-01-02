import { type Comparison, comparisons, LinterRuleReference } from "./index.js";
interface GroupedComparisons {
	eslint: Record<
		MaybeLiteral<"builtin">,
		Record<
			string, // ruleName
			Comparison
		>
	>;
}

type MaybeLiteral<T extends string> = (string & {}) | T;

export function groupByLinterAndPlugin(
	comp: typeof comparisons,
): GroupedComparisons {
	const eslint: GroupedComparisons["eslint"] = {
		builtin: {},
	};

	for (const comparison of comp) {
		for (const rule of comparison.eslint ?? []) {
			const [plugin, ruleName] = extractESLintRuleMeta(rule);
			// will work after enabling `noUncheckedIndexedAccess` in tsconfig
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			eslint[plugin] ||= {};
			eslint[plugin][ruleName] = comparison;
		}
	}

	return { eslint };
}

function extractESLintRuleMeta(
	rule: LinterRuleReference,
): [plugin: MaybeLiteral<"builtin">, ruleName: string] {
	if (rule.url.startsWith("https://eslint.org/docs")) {
		return ["builtin", rule.name];
	}

	const [plugin, ruleName] = rule.name.split("/");
	// After add prefix for all non-builtin rules, this check can be enabled
	// if (!ruleName) {
	// 	throw new Error(`Could not extract plugin and rule name from ${rule.name}`);
	// }
	return [plugin, ruleName];
}
