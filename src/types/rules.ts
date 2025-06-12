import { RuleContext } from "./context.js";
import { TSNode, TSNodeName, TSNodesByName } from "./nodes.js";
import { ReportMessageData } from "./reports.js";
import { AnyOptionalSchema, InferredObject } from "./shapes.js";

export type AnyRuleDefinition<
	OptionsSchema extends AnyOptionalSchema | undefined =
		| AnyOptionalSchema
		| undefined,
> = RuleDefinition<RuleAbout, string, OptionsSchema>;

export interface RuleAbout {
	id: string;
	preset?: string;
}

export interface RuleDefinition<
	About extends RuleAbout,
	MessageId extends string,
	OptionsSchema extends AnyOptionalSchema | undefined,
> {
	about: About;
	messages: Record<MessageId, ReportMessageData>;
	options?: OptionsSchema;
	setup: RuleSetup<MessageId, InferredObject<OptionsSchema>>;
}

export type RuleSetup<Message extends string, Options> = (
	context: RuleContext<Message>,
	options: Options,
) => RuleVisitors | undefined;

export type RuleVisitor<Node extends TSNode> = (node: Node) => void;

export type RuleVisitors = {
	[Kind in TSNodeName]?: RuleVisitor<TSNodesByName[Kind]>;
};
