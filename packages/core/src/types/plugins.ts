import type { StandardSchemaV1 } from "@standard-schema/spec";

import { FilesValue } from "./files.js";
import { AnyRule, Rule, RuleAbout } from "./rules.js";

export interface Plugin<
	About extends RuleAbout,
	FilesKey extends string | undefined,
	Rules extends AnyRule<About>[],
> {
	files: undefined extends FilesKey
		? undefined
		: Record<FilesKey & string, FilesValue>;
	name: string;
	presets: PluginPresets<About, Rules[number]["about"]["preset"]>;
	rules: PluginRulesFactory<Rules>;
	rulesById: Map<string, Rules[number]>;
}

export type PluginPresets<
	About extends RuleAbout,
	Presets extends string | undefined,
> = Record<
	Presets extends string ? Presets : never,
	Rule<About, object, object, string>[]
>;

export type PluginRulesFactory<Rules extends AnyRule[]> = (
	rulesOptions: PluginRulesOptions<Rules>,
) => Rules;

export type PluginRulesOptions<Rules extends AnyRule[]> = {
	[Rule in Rules[number] as Rule["about"]["id"]]?: Rule["options"] extends undefined
		? boolean
		: StandardSchemaV1.InferInput<Rule["options"]>;
};
