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
> = Rule<About, any, any, any, string, OptionsSchema>;

export type AnyRuleDefinition<
	OptionsSchema extends AnyOptionalSchema | undefined = any,
> = RuleDefinition<RuleAbout, any, any, any, string, OptionsSchema>;

export type AnyRuleRuntime = RuleRuntime<any, string, object, object>;
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * A single lint rule, as used by users in configs.
 */
export interface Rule<
	About extends RuleAbout,
	AstNodesByName,
	ContextServices extends object,
	FileContext extends object,
	MessageId extends string,
	OptionsSchema extends AnyOptionalSchema | undefined,
> extends RuleDefinition<
		About,
		AstNodesByName,
		ContextServices,
		FileContext,
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
	FileContext extends object,
	MessageId extends string,
	OptionsSchema extends AnyOptionalSchema | undefined,
> {
	about: About;
	messages: Record<MessageId, ReportMessageData>;
	options?: OptionsSchema;
	setup: RuleSetup<
		AstNodesByName,
		ContextServices,
		FileContext,
		MessageId,
		InferredObject<OptionsSchema>
	>;
}

export interface RuleRuntime<
	AstNodesByName,
	MessageId extends string,
	Services extends object,
	FileContext extends object,
> {
	dependencies?: string[];
	fileSetup?: (context: Services) => PromiseOrSync<FileContext>;
	visitors?: RuleVisitors<AstNodesByName, MessageId, FileContext & Services>;
}

export type RuleSetup<
	AstNodesByName,
	ContextServices extends object,
	FileContext extends object,
	MessageId extends string,
	Options,
> = (
	options: Options,
) => RuleRuntime<AstNodesByName, MessageId, ContextServices, FileContext>;

export type RuleVisitor<ASTNode, MessageId extends string, Services> = (
	node: ASTNode,
	context: RuleContext<MessageId> & Services,
) => void;

export type RuleVisitors<AstNodesByName, MessageId extends string, Services> = {
	[Kind in keyof AstNodesByName]?: RuleVisitor<
		AstNodesByName[Kind],
		MessageId,
		Services
	>;
};
