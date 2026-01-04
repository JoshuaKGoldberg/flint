import type { PromiseOrSync } from "@flint.fyi/utils";

import type { BaseAbout } from "./about.ts";
import type { RuleContext } from "./context.ts";
import type { Language } from "./languages.ts";
import type { ReportMessageData } from "./reports.ts";
import type { AnyOptionalSchema, InferredObject } from "./shapes.ts";

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
	FileServices extends object,
	MessageId extends string,
	OptionsSchema extends AnyOptionalSchema | undefined,
> extends RuleDefinition<
	About,
	AstNodesByName,
	FileServices,
	MessageId,
	OptionsSchema
> {
	language: Language<AstNodesByName, FileServices>;
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
	FileServices extends object,
	MessageId extends string,
	OptionsSchema extends AnyOptionalSchema | undefined,
> {
	about: About;
	messages: Record<MessageId, ReportMessageData>;
	options?: OptionsSchema;
	setup: RuleSetup<
		AstNodesByName,
		FileServices,
		MessageId,
		InferredObject<OptionsSchema>
	>;
}

export interface RuleRuntime<AstNodesByName, FileServices extends object> {
	dependencies?: string[];
	teardown?: RuleTeardown;
	visitors?: RuleVisitors<AstNodesByName, FileServices>;
}

export type RuleSetup<
	AstNodesByName,
	FileServices extends object,
	MessageId extends string,
	Options,
> = (
	context: RuleContext<MessageId>,
) => PromiseOrSync<
	RuleRuntime<AstNodesByName, FileServices & { options: Options }> | undefined
>;

export type RuleTeardown = () => PromiseOrSync<undefined>;

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
