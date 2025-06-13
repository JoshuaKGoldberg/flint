/**
 * A range of characters in a source file, as reported by a rule.
 */
export interface CharacterReportRange {
	begin: number;
	end: number;
}

/**
 * The column and line of a character in a source file, as visualized to users.
 */
export interface ColumnAndLine {
	column: number;
	line: number;

	/**
	 * The original raw character position in the source file.
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

	/**
	 * Which specific
	 */
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
