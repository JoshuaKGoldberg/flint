import type { AnyRule } from "../types/rules.ts";
import type { ConfigUseDefinitionWithFiles } from "./computeUseDefinitions.ts";

// TODO: This is very slow and the whole thing should be refactored 🙌.
// The separate lintFile function recomputes rule options repeatedly.
// It'd be better to build a collection of groups with options
export function computeRulesWithOptions(
	filePath: string,
	useDefinitions: ConfigUseDefinitionWithFiles[],
) {
	const ruleDefinitionsToRun = useDefinitions
		.filter((use) => use.found.has(filePath))
		.flatMap((use) => use.rules);
	const rulesWithOptions = new Map<AnyRule, unknown>();

	for (const definition of ruleDefinitionsToRun) {
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
