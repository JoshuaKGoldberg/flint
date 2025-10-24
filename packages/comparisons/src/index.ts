import data from "./data.json" with { type: "json" };

export function getComparisonId(pluginId: string, ruleId: string) {
	return [pluginId, ruleId].join("/");
}

export const linterNames = {
	biome: "Biome",
	deno: "Deno",
	eslint: "ESLint",
	markdownlint: "Markdownlint",
	oxlint: "Oxlint",
} as const satisfies Record<Linter, string>;

const comparisons: Comparison[] = data;

export { comparisons };

export interface Comparison {
	biome?: LinterRuleReference[];
	deno?: LinterRuleReference[];
	eslint?: LinterRuleReference[];
	flint: FlintRuleReference;
	markdownlint?: LinterRuleReference[];
	notes?: string;
	oxlint?: LinterRuleReference[];
}

export interface FlintRuleReference {
	implemented?: boolean;
	name: string;
	plugin: string;
	preset: string;
	strictness?: string;
}

export type Linter = "biome" | "deno" | "eslint" | "markdownlint" | "oxlint";

export interface LinterRuleReference {
	name: string;
	url: string;
}
