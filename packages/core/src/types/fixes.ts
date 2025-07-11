import { CharacterReportRange } from "./ranges.js";

/**
 * A "fix" (change to text) to be made to a file.
 */
export interface Fix {
	/**
	 * Range of text in the files to be updated.
	 */
	range: CharacterReportRange;

	/**
	 * New value for the text in the range.
	 */
	text: string;
}
