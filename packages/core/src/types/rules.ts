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
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * A single lint rule, as used by users in configs.
 */
export interface Rule<
	About extends RuleAbout,
	AstNodesByName,
	ContextServices extends object,
	in out FileContext extends object | undefined,
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
	FileContext extends object | undefined,
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

export type RuleRuntime<
	AstNodesByName,
	MessageId extends string,
	ContextServices extends object,
	FileContext extends object | undefined,
> = FileContext extends undefined
	? StatelessRuleRuntime<AstNodesByName, MessageId, ContextServices>
	: FileContext extends object
		? StatefulRuleRuntime<
				AstNodesByName,
				MessageId,
				ContextServices,
				FileContext
			>
		: never;

interface StatefulRuleRuntime<
	in out AstNodesByName,
	out MessageId extends string,
	in ContextServices extends object,
	in out FileContext extends object,
> {
	dependencies?: string[];
	fileSetup: (context: ContextServices) => PromiseOrSync<FileContext>;
	skipFile?: (context: ContextServices) => PromiseOrSync<boolean>;
	visitors?: RuleVisitors<
		AstNodesByName,
		MessageId,
		ContextServices & FileContext
	>;
}

interface StatelessRuleRuntime<
	in out AstNodesByName,
	out MessageId extends string,
	in ContextServices extends object,
> {
	dependencies?: string[];
	skipFile?: (context: ContextServices) => PromiseOrSync<boolean>;
	visitors?: RuleVisitors<AstNodesByName, MessageId, ContextServices>;
}

/**
 * Create an instance of {@linkcode RuleRuntime} given the {@linkcode Rule}’s options.
 */
export type RuleSetup<
	in out AstNodesByName,
	in ContextServices extends object,
	in out FileContext extends object | undefined,
	out MessageId extends string,
	in Options,
> = (
	options: Options,
) => RuleRuntime<AstNodesByName, MessageId, ContextServices, FileContext>;

export type RuleVisitor<ASTNode, MessageId extends string, Services> = (
	node: ASTNode,
	context: RuleContext<MessageId> & Services,
) => void;

export type RuleVisitors<
	in out AstNodesByName,
	out MessageId extends string,
	in Services,
> = {
	[Kind in keyof AstNodesByName]?: RuleVisitor<
		AstNodesByName[Kind],
		MessageId,
		Services
	>;
};
