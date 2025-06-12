import type * as ts from "typescript";

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

/**
 * A full rule report that can be used to display to users via a reporter.
 */
export interface NormalizedRuleReport {
	message: ReportMessageData;
	range: NormalizedReportRangeObject;
}

/**
 * The internal raw rule report format used by rules themselves.
 */
export interface RuleReport<Message extends string = string> {
	message: Message;
	range: CharacterReportRange;
}

/**
 * Full data for a report message to be displayed to users.
 */
export interface ReportMessageData {
	/**
	 * A single sentence explaining what's wrong.
	 */
	primary: string;

	/**
	 * Additional sentences explaining the problem in more detail.
	 */
	secondary: string[];

	/**
	 * Recommendations for how to fix the problem.
	 */
	suggestions: string[];
}
