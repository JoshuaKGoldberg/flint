import { CharacterReportRange } from "./ranges.js";

/**
 * A "suggestion" (potentially unsafe text change) to be made to a file.
 */
export interface Suggestion {
	/**
	 * Range of text in the file to be updated.
	 */
	range: CharacterReportRange;

	/**
	 * New value for the text in the range.
	 */
	text: string;
}
