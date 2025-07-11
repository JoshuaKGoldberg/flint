export interface InvalidTestCase<Options extends object | undefined>
	extends TestCase<Options> {
	output?: string;
	snapshot: string;
}

export interface TestCase<
	Options extends object | undefined = object | undefined,
> {
	code: string;
	fileName?: string;
	options?: Options;
}

export type ValidTestCase<Options extends object | undefined> =
	| string
	| ValidTestCaseObject<Options>;

export type ValidTestCaseObject<Options extends object | undefined> =
	TestCase<Options>;
