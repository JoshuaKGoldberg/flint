import { RuleContext } from "./context.js";
import { Language } from "./languages.js";
import { PromiseOrSync } from "./promises.js";
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
	AstNodesByName,
	ContextServices extends object,
	MessageId extends string,
	OptionsSchema extends AnyOptionalSchema | undefined,
> extends RuleDefinition<
		About,
		AstNodesByName,
		ContextServices,
		MessageId,
		OptionsSchema
	> {
	language: Language<AstNodesByName, ContextServices>;
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
	AstNodesByName,
	ContextServices extends object,
	MessageId extends string,
	OptionsSchema extends AnyOptionalSchema | undefined,
> {
	about: About;
	messages: Record<MessageId, ReportMessageData>;
	options?: OptionsSchema;
	setup: RuleSetup<
		AstNodesByName,
		ContextServices,
		MessageId,
		InferredObject<OptionsSchema>
	>;
}

export type RuleSetup<
	AstNodesByName,
	ContextServices extends object,
	MessageId extends string,
	Options,
> = (
	context: ContextServices & RuleContext<MessageId>,
	options: Options,
) => PromiseOrSync<RuleVisitors<AstNodesByName> | undefined>;

export type RuleVisitor<ASTNode> = (node: ASTNode) => void;

export type RuleVisitors<AstNodesByName> = {
	[Kind in keyof AstNodesByName]?: RuleVisitor<AstNodesByName[Kind]>;
};
