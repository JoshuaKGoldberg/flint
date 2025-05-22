import { Plugin, PluginPresets } from "../types/plugins.js";
import { RuleAbout, RuleDefinition } from "../types/rules.js";
import { AnyOptionalSchema } from "../types/shapes.js";

export interface CreatePluginOptions<
	About extends RuleAbout,
	Rules extends RuleDefinition<About, string, AnyOptionalSchema | undefined>[],
> {
	name: string;
	rules: Rules;
}

export function createPlugin<
	const About extends RuleAbout,
	// TODO: How to properly constrain this type parameter?
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const Rules extends RuleDefinition<About, any, any>[],
>({ name, rules }: CreatePluginOptions<About, Rules>): Plugin<About, Rules> {
	const presets = Object.groupBy(
		rules.filter((rule) => typeof rule.about.preset === "string"),
		// TODO: Figure out inferred type predicate...
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		(rule) => rule.about.preset!,
	) as PluginPresets<About>;

	const rulesById = new Map(rules.map((rule) => [rule.about.id, rule]));

	return {
		name,
		presets,
		// @ts-expect-error -- TODO: Figure out what to assert...?
		rules: (configuration) => {
			return Object.entries(configuration).map(([id, options]) => ({
				options,
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				rule: rulesById.get(id)!,
			}));
		},
	};
}
