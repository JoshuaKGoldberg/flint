import { AnyRule, RuleAbout, RuleDefinition } from "./rules.js";
import { AnyOptionalSchema, InferredObject } from "./shapes.js";

export interface Plugin<
	About extends RuleAbout,
	Globs extends Record<string, string[]>,
	Rules extends AnyRule<About>[],
> {
	globs: Globs;
	name: string;
	presets: PluginPresets<About, Rules[number]["about"]["preset"]>;
	rules: PluginRulesFactory<Rules>;
}

export type PluginPresets<
	About extends RuleAbout,
	Presets extends string | undefined,
> = Record<
	Presets extends string ? Presets : never,
	RuleDefinition<About, object, object, string, AnyOptionalSchema | undefined>[]
>;

export type PluginRulesFactory<Rules extends AnyRule[]> = (
	rulesOptions: PluginRulesOptions<Rules>,
) => Rules;

export type PluginRulesOptions<Rules extends AnyRule[]> = {
	[Rule in Rules[number] as Rule["about"]["id"]]?: Rule["options"] extends undefined
		? boolean
		: boolean | InferredObject<Rule["options"]>;
};
