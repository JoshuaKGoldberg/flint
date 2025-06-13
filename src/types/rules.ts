import { RuleContext } from "./context.js";
import { Language } from "./languages.js";
import { TSNode, TSNodeName, TSNodesByName } from "./nodes.js";
import { ReportMessageData } from "./reports.js";
import { AnyOptionalSchema, InferredObject } from "./shapes.js";

export type AnyRule<
	About extends RuleAbout = RuleAbout,
	OptionsSchema extends AnyOptionalSchema | undefined =
		| AnyOptionalSchema
		| undefined,
> = Rule<
	About,
	// TODO: How to make types more permissive around assignability?
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any,
	string,
	OptionsSchema
>;

export type AnyRuleDefinition<
	OptionsSchema extends AnyOptionalSchema | undefined =
		| AnyOptionalSchema
		| undefined,
> = RuleDefinition<
	RuleAbout,
	// TODO: How to make types more permissive around assignability?
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any,
	string,
	OptionsSchema
>;

/**
 * A single lint rule, as used by users in configs.
 */
export interface Rule<
	About extends RuleAbout,
	ContextServices extends object,
	MessageId extends string,
	OptionsSchema extends AnyOptionalSchema | undefined,
> extends RuleDefinition<About, ContextServices, MessageId, OptionsSchema> {
	language: Language<ContextServices>;
}

export interface RuleAbout {
	id: string;
	preset?: string;
}

/**
 * The definition of a rule, as provided to rule creators internally.
 */
export interface RuleDefinition<
	About extends RuleAbout,
	ContextServices extends object,
	MessageId extends string,
	OptionsSchema extends AnyOptionalSchema | undefined,
> {
	about: About;
	messages: Record<MessageId, ReportMessageData>;
	options?: OptionsSchema;
	setup: RuleSetup<ContextServices, MessageId, InferredObject<OptionsSchema>>;
}

export type RuleSetup<
	ContextServices extends object,
	MessageId extends string,
	Options,
> = (
	context: ContextServices & RuleContext<MessageId>,
	options: Options,
) => RuleVisitors | undefined;

export type RuleVisitor<Node extends TSNode> = (node: Node) => void;

export type RuleVisitors = {
	[Kind in TSNodeName]?: RuleVisitor<TSNodesByName[Kind]>;
};
