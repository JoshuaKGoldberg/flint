import { AnyLanguage } from "./languages.js";
import { AnyRule, RuleAbout, RuleDefinition } from "./rules.js";
import { AnyOptionalSchema, InferredObject } from "./shapes.js";

export interface Plugin<
	About extends RuleAbout,
	Globs extends Record<string, PluginGlob[]>,
	Rules extends AnyRule<About>[],
> {
	globs: Globs;
	name: string;
	presets: PluginPresets<About, Rules[number]["about"]["preset"]>;
	rules: PluginRulesFactory<Rules>;
}

export interface PluginGlob {
	files: string | string[];
	language: AnyLanguage;
}

export type PluginPresets<
	About extends RuleAbout,
	Presets extends string | undefined,
> = Record<
	Presets extends string ? Presets : never,
	RuleDefinition<About, object, string, AnyOptionalSchema | undefined>[]
>;

export type PluginRulesFactory<Rules extends AnyRule[]> = (
	rulesOptions: PluginRulesOptions<Rules>,
) => Rules;

export type PluginRulesOptions<Rules extends AnyRule[]> = {
	[Rule in Rules[number] as Rule["about"]["id"]]?: Rule["options"] extends undefined
		? boolean
		: boolean | InferredObject<Rule["options"]>;
};
