import { ConfigRuleDefinition } from "../types/configs.js";
import { AnyRule } from "../types/rules.js";

// TODO: This is very slow and the whole thing should be refactored 🙌.
// The separate lintFile function recomputes rule options repeatedly.
// It'd be better to build a collection of groups with options
export function computeRulesWithOptions(
	ruleDefinitions: ConfigRuleDefinition[],
) {
	const rulesWithOptions = new Map<AnyRule, unknown>();

	for (const definition of ruleDefinitions) {
		const [options, rule] =
			"rule" in definition
				? [definition.options, definition.rule]
				: [undefined, definition];

		const existing = rulesWithOptions.get(rule);

		if (!existing) {
			rulesWithOptions.set(rule, options ?? {});
		} else if (options === false) {
			rulesWithOptions.delete(rule);
		} else if (typeof options === "object") {
			rulesWithOptions.set(rule, {
				...existing,
				...options,
			});
		} else {
			rulesWithOptions.set(rule, {});
		}
	}

	return rulesWithOptions;
}
