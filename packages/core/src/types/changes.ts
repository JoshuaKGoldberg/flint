import { CharacterReportRange } from "./ranges.js";

export type Change = Fix | Suggestion;

/**
 * A "fix" (safe text change) to be made to a file.
 */
export interface Fix {
	/**
	 * Range of text in the file to be updated.
	 */
	range: CharacterReportRange;

	/**
	 * New value for the text in the range.
	 */
	text: string;
}

/**
 * A "suggestion" (potentially unsafe text change) to be made to a file.
 */
export interface Suggestion {
	/**
	 * User-facing identifier allowing the suggestion to be referenced.
	 */
	id: string;

	/**
	 * Range of text in the file to be updated.
	 */
	range: CharacterReportRange;

	/**
	 * New value for the text in the range.
	 */
	text: string;
}
