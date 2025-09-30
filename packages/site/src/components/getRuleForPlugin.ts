import { cspell } from "@flint.fyi/plugin-cspell";
import { flint } from "@flint.fyi/plugin-flint";
import { type AnyRule, json, md, ts, yml } from "flint";

const plugins = { cspell, flint, json, md, ts, yml };

export function getRuleForPlugin(pluginId: string, ruleId: string): AnyRule {
	if (!(pluginId in plugins)) {
		throw new Error(`Unknown Flint plugin: ${pluginId}.`);
	}

	const plugin = plugins[pluginId as keyof typeof plugins];
	const rule = plugin.rulesById.get(ruleId);

	if (!rule) {
		throw new Error(`Unknown rule for ${pluginId}: ${ruleId}.`);
	}

	return rule as AnyRule;
}
