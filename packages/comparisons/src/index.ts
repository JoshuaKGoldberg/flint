import dataRaw from "./data.json" with { type: "json" };

const data: Record<string, Rule> = dataRaw;

export { data };

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

export interface Rule {
	biome?: LinterRuleReference[];
	deno?: LinterRuleReference[];
	eslint?: LinterRuleReference[];
	flint: FlintRuleReference;
	notes?: string;
	oxlint?: LinterRuleReference[];
}
