import { Fix } from "./fixes.js";
import { CharacterReportRange, ColumnAndLine } from "./ranges.js";

export interface FileRuleReport extends NormalizedRuleReport {
	ruleId: string;
}

export interface FileRuleReportWithFix extends FileRuleReport {
	fix: Fix;
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
	fix?: Fix;
	message: ReportMessageData;
	range: NormalizedReportRangeObject;
}

export interface NormalizedRuleReportWithFix extends NormalizedRuleReport {
	fix: Fix;
}

/**
 * The internal raw rule report format used by rules themselves.
 */
export interface RuleReport<Message extends string = string> {
	fix?: Fix;

	message: Message;

	/**
	 * Which specific characters in the source file are affected by this report.
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
