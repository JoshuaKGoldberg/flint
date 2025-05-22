import { RuleAbout, RuleDefinition } from "./rules.js";
import { AnyOptionalSchema, InferredObject } from "./shapes.js";

export interface Plugin<
	About extends RuleAbout,
	Rules extends RuleDefinition<About, string, AnyOptionalSchema | undefined>[],
> {
	name: string;
	presets: PluginPresets<About>;
	rules: PluginRulesFactory<Rules>;
}

export type PluginPresets<About extends RuleAbout> = Record<
	About["preset"] extends string ? About["preset"] : never,
	RuleDefinition<About, string, AnyOptionalSchema | undefined>[]
>;

export type PluginRulesFactory<
	Rules extends RuleDefinition<
		RuleAbout,
		string,
		AnyOptionalSchema | undefined
	>[],
> = (rulesOptions: PluginRulesOptions<Rules>) => Rules;

export type PluginRulesOptions<
	Rules extends RuleDefinition<
		RuleAbout,
		string,
		AnyOptionalSchema | undefined
	>[],
> = {
	[Rule in Rules[number] as Rule["about"]["id"]]?: Rule["options"] extends undefined
		? boolean
		: boolean | InferredObject<Rule["options"]>;
};
