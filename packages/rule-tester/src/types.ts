export interface InvalidTestCase<
	Options extends object | undefined = object | undefined,
> extends TestCase<Options> {
	output?: string;
	snapshot: string;
	suggestions?: TestSuggestion[];
}

export interface TestCase<
	Options extends object | undefined = object | undefined,
> {
	code: string;
	fileName?: string;

	/**
	 * Run only this test case. Useful for debugging.
	 *
	 * Do not commit code with this flag set.
	 */
	only?: boolean;

	options?: Options;

	/**
	 * Skip running this test case. Useful for work-in-progress tests.
	 */
	skip?: boolean;
}

export interface TestSuggestion {
	files: Record<string, TestSuggestionFileCase[]>;
	id: string;
}

export interface TestSuggestionFileCase {
	original: string;
	updated: string;
}

export type ValidTestCase<Options extends object | undefined> =
	| string
	| ValidTestCaseObject<Options>;

export type ValidTestCaseObject<Options extends object | undefined> =
	TestCase<Options>;
