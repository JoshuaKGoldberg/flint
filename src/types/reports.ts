import type * as ts from "typescript";

/**
 * Mapping from file paths to their rule reports.
 */
export type CharacterReportRange = CharacterReportRangeObject | ts.Node;

export interface CharacterReportRangeObject {
	begin: number;
	end: number;
}

export interface ColumnAndLine {
	column: number;
	line: number;

	/**
	 * The raw character position in source file text.
	 */
	raw: number;
}

export interface FileRuleReport extends NormalizedRuleReport {
	ruleId: string;
}

export type FilesRuleReports = Map<string, FileRuleReport[]>;

export interface NormalizedReportRangeObject {
	begin: ColumnAndLine;
	end: ColumnAndLine;
}

export interface NormalizedRuleReport<Message extends string = string> {
	message: Message;
	range: NormalizedReportRangeObject;
}

export interface RuleReport<Message extends string = string> {
	message: Message;
	range: CharacterReportRange;
}
