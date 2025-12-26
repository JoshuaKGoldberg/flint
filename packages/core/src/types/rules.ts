import { BaseAbout } from "./about.js";
import { RuleContext } from "./context.js";
import { Language } from "./languages.js";
import { PromiseOrSync } from "./promises.js";
import { ReportMessageData } from "./reports.js";
import { AnyOptionalSchema, InferredObject } from "./shapes.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyRule<
	About extends RuleAbout = RuleAbout,
	OptionsSchema extends AnyOptionalSchema | undefined = any,
> = Rule<About, any, any, string, OptionsSchema>;

export type AnyRuleDefinition<
	OptionsSchema extends AnyOptionalSchema | undefined = any,
> = RuleDefinition<RuleAbout, any, any, string, OptionsSchema>;
/* eslint-enable @typescript-eslint/no-explicit-any */

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

export interface RuleAbout extends BaseAbout {
	description: string;
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

export interface RuleRuntime<AstNodesByName, FileServices extends object> {
	dependencies?: string[];
	visitors?: RuleVisitors<AstNodesByName, FileServices>;
}

export type RuleSetup<
	AstNodesByName,
	ContextServices extends object,
	MessageId extends string,
	Options,
> = (
	context: ContextServices & RuleContext<MessageId>,
	options: Options,
) => PromiseOrSync<
	| RuleRuntime<AstNodesByName, ContextServices & { options: Options }>
	| undefined
>;

export type RuleVisitor<ASTNode, FileServices extends object> = (
	node: ASTNode,
	services: FileServices,
) => void;

export type RuleVisitors<AstNodesByName, FileServices extends object> = {
	[Kind in keyof AstNodesByName]?: RuleVisitor<
		AstNodesByName[Kind],
		FileServices
	>;
};
