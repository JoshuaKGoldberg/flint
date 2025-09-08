import { BaseAbout } from "./about.js";
import { Fix, Suggestion } from "./changes.js";
import { CharacterReportRange, ColumnAndLine } from "./ranges.js";

export interface FileReport extends NormalizedReport {
	/**
	 * Metadata on the rule or other system that created this report.
	 */
	about: BaseAbout;
}

export interface FileReportWithFix extends FileReport {
	fix: Fix;
}

export interface NormalizedReportRangeObject {
	begin: ColumnAndLine;
	end: ColumnAndLine;
}

/**
 * A full rule report that can be used to display to users via a reporter.
 */
export interface NormalizedReport {
	data?: ReportInterpolationData;

	/**
	 * Any files that should be factored into caching this report.
	 */
	dependencies?: string[];

	fix?: Fix;
	message: ReportMessageData;
	range: NormalizedReportRangeObject;
	suggestions?: Suggestion[];
}

export interface NormalizedRuleReportWithFix extends NormalizedReport {
	fix: Fix;
}

export type ReportInterpolationData = Record<string, boolean | number | string>;

/**
 * The internal raw rule report format used by rules themselves.
 */
export interface RuleReport<Message extends string = string> {
	data?: ReportInterpolationData;

	/**
	 * Any files that should be factored into caching this report.
	 */
	dependencies?: string[];

	fix?: Fix;
	message: Message;
	suggestions?: Suggestion[];

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
