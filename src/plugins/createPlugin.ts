import { Plugin, PluginPresets } from "../types/plugins.js";
import { Rule, RuleAbout } from "../types/rules.js";

export interface CreatePluginOptions<
	About extends RuleAbout,
	Globs extends Record<string, string[]>,
	Rules extends UnsafeAnyRule<About>[],
> {
	// TODO: Make this optional if Globs is {}
	globs: Globs;
	name: string;
	rules: Rules;
}

export type UnsafeAnyRule<About extends RuleAbout = RuleAbout> = Rule<
	About,
	// TODO: How to make these types work with createPlugin.test.ts & co.?
	/* eslint-disable @typescript-eslint/no-explicit-any */
	any,
	any,
	any
	/* eslint-enable @typescript-eslint/no-explicit-any */
>;

export function createPlugin<
	About extends RuleAbout,
	Globs extends Record<string, string[]>,
	Rules extends UnsafeAnyRule<About>[],
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
