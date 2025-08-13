import { FilesValue } from "./files.js";
import { AnyRule, BaseAbout, Rule } from "./rules.js";
import { AnyOptionalSchema, InferredObject } from "./shapes.js";

export interface Plugin<
	About extends BaseAbout,
	FilesKey extends string | undefined,
	Rules extends AnyRule<About>[],
> {
	files: FilesKey extends string ? Record<FilesKey, FilesValue> : undefined;
	name: string;
	presets: PluginPresets<About, Rules[number]["about"]["preset"]>;
	rules: PluginRulesFactory<Rules>;
}

export type PluginPresets<
	About extends BaseAbout,
	Presets extends string | undefined,
> = Record<
	Presets extends string ? Presets : never,
	Rule<About, object, object, string, AnyOptionalSchema | undefined>[]
>;

export type PluginRulesFactory<Rules extends AnyRule[]> = (
	rulesOptions: PluginRulesOptions<Rules>,
) => Rules;

export type PluginRulesOptions<Rules extends AnyRule[]> = {
	[Rule in Rules[number] as Rule["about"]["id"]]?: Rule["options"] extends undefined
		? boolean
		: boolean | InferredObject<Rule["options"]>;
};
