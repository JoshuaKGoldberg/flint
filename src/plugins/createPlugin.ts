import { Plugin, PluginPresets } from "../types/plugins.js";
import { RuleAbout, RuleDefinition } from "../types/rules.js";
import { AnyOptionalSchema } from "../types/shapes.js";

export interface CreatePluginOptions<
	About extends RuleAbout,
	Globs extends Record<string, string[]>,
	Rules extends RuleDefinition<About, string, AnyOptionalSchema | undefined>[],
> {
	globs: Globs;
	name: string;
	rules: Rules;
}

export function createPlugin<
	const About extends RuleAbout,
	Globs extends Record<string, string[]>,
	// TODO: How to properly constrain this type parameter?
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const Rules extends RuleDefinition<About, any, any>[],
>({
	globs,
	name,
	rules,
}: CreatePluginOptions<About, Globs, Rules>): Plugin<About, Globs, Rules> {
	const presets = Object.groupBy(
		rules.filter((rule) => typeof rule.about.preset === "string"),
		// TODO: Figure out inferred type predicate...
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		(rule) => rule.about.preset!,
	) as PluginPresets<About, string>;

	const rulesById = new Map(rules.map((rule) => [rule.about.id, rule]));

	return {
		globs,
		name,
		// @ts-expect-error -- TODO: Figure this out...?
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
