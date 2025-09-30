import { comparisons, getComparisonId } from "@flint.fyi/comparisons";

const comparisonsByFlintId = Object.fromEntries(
	comparisons.map((comparison) => [
		getComparisonId(comparison.flint.plugin.code, comparison.flint.name),
		comparison,
	]),
);

export function getComparisonByFlintId(pluginId: string, ruleId: string) {
	return comparisonsByFlintId[getComparisonId(pluginId, ruleId)];
}
