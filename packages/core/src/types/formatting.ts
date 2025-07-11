export interface FormattingResults {
	clean: Set<string>;
	dirty: Set<string>;

	/**
	 * Whether cleaned versions of files were written to disk.
	 */
	written: boolean;
}
