import { RuleAbout, RuleDefinition } from "./types/rules.js";
import { AnyOptionalSchema } from "./types/shapes.js";

export function createRule<
	const About extends RuleAbout,
	const MessageId extends string,
>(definition: RuleDefinition<About, MessageId, undefined>): typeof definition;
export function createRule<
	const About extends RuleAbout,
	const MessageId extends string,
	const OptionsSchema extends AnyOptionalSchema,
>(
	definition: RuleDefinition<About, MessageId, OptionsSchema>,
): typeof definition;
export function createRule<
	const About extends RuleAbout,
	const MessageId extends string,
	const OptionsSchema extends AnyOptionalSchema | undefined,
>(definition: RuleDefinition<About, MessageId, OptionsSchema>) {
	return definition;
}
