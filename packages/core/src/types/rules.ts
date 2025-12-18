import type { AnyOptionalSchema, InferredObject } from "./shapes.js";

import { BaseAbout } from "./about.js";
import { RuleContext } from "./context.js";
import { Language } from "./languages.js";
import { PromiseOrSync } from "./promises.js";
import { ReportMessageData } from "./reports.js";

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

export interface RuleRuntime<
	in out AstNodesByName,
	out MessageId extends string,
	in ContextServices extends object,
	in Options,
> {
	dependencies: string[];
	skipFile: (context: ContextServices) => PromiseOrSync<boolean>;
	visitors: RuleVisitors<AstNodesByName, MessageId, ContextServices, Options>;
}

/**
 * Create an instance of {@linkcode RuleRuntime} given the {@linkcode Rule}’s options.
 */
export type RuleSetup<
	in out AstNodesByName,
	in ContextServices extends object,
	out MessageId extends string,
	in Options,
> = () => RuleRuntime<AstNodesByName, MessageId, ContextServices, Options>;

export type RuleVisitor<
	ASTNode,
	MessageId extends string,
	Services,
	Options,
> = (
	node: ASTNode,
	context: RuleContext<MessageId> & Services,
	options: Options,
) => void;

export type RuleVisitors<
	in out AstNodesByName,
	out MessageId extends string,
	in Services,
	in Options,
> = {
	[Kind in keyof AstNodesByName]?: RuleVisitor<
		AstNodesByName[Kind],
		MessageId,
		Services,
		Options
	>;
};
