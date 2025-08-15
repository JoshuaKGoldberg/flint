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

/**
 * A range of characters in a source file, as included in a report.
 */
export interface CharacterReportRange {
	begin: number;
	end: number;
}
