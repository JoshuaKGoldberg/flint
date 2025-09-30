import data from "./data.json" with { type: "json" };

export function getComparisonId(pluginId: string, ruleId: string) {
	return [pluginId, ruleId].join("/");
}

const comparisons: Comparison[] = data;

export { comparisons };

export interface Comparison {
	biome?: LinterRuleReference[];
	deno?: LinterRuleReference[];
	eslint?: LinterRuleReference[];
	flint: FlintRuleReference;
	notes?: string;
	oxlint?: LinterRuleReference[];
}

export interface FlintRulePluginReference {
	code: string;
	name: string;
}

export interface FlintRuleReference {
	implemented?: boolean;
	name: string;
	plugin: FlintRulePluginReference;
	preset: string;
	strictness?: string;
}

export type Linter = "biome" | "deno" | "eslint" | "oxlint";

export interface LinterRuleReference {
	name: string;
	url: string;
}
