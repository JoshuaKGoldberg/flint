import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";

import {
	ConfigRuleDefinition,
	ConfigUseDefinition,
	NormalizedConfigUseDefinition,
} from "../types/configs.js";
import { AnyRuleDefinition } from "../types/rules.js";

const log = debugForFile(import.meta.filename);

export async function lintFile(
	file: string,
	ruleDefinitions: ConfigRuleDefinition[],
) {
	log("Linting: %s", file);
	//

	const rulesWithOptions = new Map<AnyRuleDefinition, unknown>();

	for (const definition of ruleDefinitions) {
		const [options, rule] =
			"rule" in definition
				? [definition.options, definition.rule]
				: [undefined, definition];

		const existing = rulesWithOptions.get(rule);

		if (!existing) {
			rulesWithOptions.set(rule, options);
		} else if (options === false) {
			rulesWithOptions.delete(rule);
		} else if (typeof options === "object") {
			rulesWithOptions.set(rule, {
				...existing,
				...options,
			});
		}
	}

	for (const [rule, options] of rulesWithOptions) {
		log("Rule %s with options: %o", rule.about.id, options);
	}
}
