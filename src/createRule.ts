import { RuleAbout, RuleDefinition } from "./types/rules.js";
import { AnyOptionalSchema } from "./types/shapes.js";

export function createRule<
	const About extends RuleAbout,
	const Message extends string,
>(definition: RuleDefinition<About, Message, undefined>): typeof definition;
export function createRule<
	const About extends RuleAbout,
	const Message extends string,
	const OptionsSchema extends AnyOptionalSchema,
>(definition: RuleDefinition<About, Message, OptionsSchema>): typeof definition;
export function createRule<
	const About extends RuleAbout,
	const Message extends string,
	const OptionsSchema extends AnyOptionalSchema | undefined,
>(definition: RuleDefinition<About, Message, OptionsSchema>) {
	return definition;
}
