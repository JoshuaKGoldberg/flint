import type * as ts from "typescript";

export type ReportRange = ReportRangeObject | ts.Node;

export interface ReportRangeObject {
	begin: number;
	end: number;
}

export interface RuleReport<Message extends string = string> {
	message: Message;
	range: ReportRange;
}
