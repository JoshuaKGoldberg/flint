import { StandardSchemaV1 } from "@standard-schema/spec";

import { BaseAbout } from "./about.js";
import { RuleContext } from "./context.js";
import { Language } from "./languages.js";
import { PromiseOrSync } from "./promises.js";
import { ReportMessageData } from "./reports.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyRule<
	About extends RuleAbout = RuleAbout,
	OptionsSchema extends StandardSchemaV1 = StandardSchemaV1,
> = Rule<About, any, any, string, OptionsSchema>;

export type AnyRuleDefinition<
	OptionsSchema extends StandardSchemaV1 = StandardSchemaV1,
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
	OptionsSchema extends StandardSchemaV1 = StandardSchemaV1,
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
	OptionsSchema extends StandardSchemaV1,
> {
	about: About;
	messages: Record<MessageId, ReportMessageData>;
	options: StandardSchemaV1;
	setup: RuleSetup<
		AstNodesByName,
		ContextServices,
		MessageId,
		StandardSchemaV1.InferOutput<OptionsSchema>
	>;
}

export interface RuleRuntime<
	AstNodesByName,
	MessageId extends string,
	Services,
> {
	dependencies?: string[];
	visitors?: RuleVisitors<AstNodesByName, MessageId, Services>;
}

export type RuleSetup<
	AstNodesByName,
	ContextServices extends object,
	MessageId extends string,
	Options,
> = (
	options: Options,
) => PromiseOrSync<RuleRuntime<AstNodesByName, MessageId, ContextServices>>;

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
