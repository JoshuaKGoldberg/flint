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

export type AnyRuleRuntime<Options extends object | undefined = any> =
	RuleRuntime<any, object, Options>;
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

export interface RuleRuntime<
	AstNodesByName,
	FileServices extends object,
	Options,
> {
	dependencies?: string[];
	teardown?: RuleTeardown;
	visitors?: RuleVisitors<AstNodesByName, FileServices, Options>;
}

export type RuleSetup<
	AstNodesByName,
	FileServices extends object,
	MessageId extends string,
	Options,
> = (
	context: RuleContext<MessageId>,
) => PromiseOrSync<RuleRuntime<AstNodesByName, FileServices, Options>>;

export type RuleTeardown = () => PromiseOrSync<undefined>;

export type RuleVisitor<ASTNode, FileServices extends object, Options> = (
	node: ASTNode,
	data: RuleVisitorData<FileServices, Options>,
) => void;

export type RuleVisitorData<FileServices, Options> = FileServices & {
	options: Options;
};

export type RuleVisitors<
	AstNodesByName,
	FileServices extends object,
	Options,
> = {
	[Kind in keyof AstNodesByName]?: RuleVisitor<
		AstNodesByName[Kind],
		FileServices,
		Options
	>;
};
