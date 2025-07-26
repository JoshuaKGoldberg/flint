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
	options?: Options;
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
