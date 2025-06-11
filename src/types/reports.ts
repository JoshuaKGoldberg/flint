import type * as ts from "typescript";

/**
 * Mapping from file paths to their rule reports.
 */
export type FilesRuleReports = Map<string, FileRuleReport[]>;

export interface FileRuleReport extends NormalizedRuleReport {
	ruleId: string;
}

export interface NormalizedRuleReport<Message extends string = string> {
	message: Message;
	range: ReportRangeObject;
}

export type ReportRange = ReportRangeObject | ts.Node;

export interface ReportRangeObject {
	begin: number;
	end: number;
}

export interface RuleReport<Message extends string = string> {
	message: Message;
	range: ReportRange;
}
