import { RuleReport } from "./reports.js";

export interface RuleContext<MessageId extends string> {
	report: RuleReporter<MessageId>;
}

export type RuleReporter<MessageId extends string> = (
	report: RuleReport<MessageId>,
) => void;
