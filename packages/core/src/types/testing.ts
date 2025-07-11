export interface CommonTestCase<Options extends object | undefined> {
	code: string;
	fileName?: string;
	options?: Options;
}

export interface InvalidTestCase<Options extends object | undefined>
	extends CommonTestCase<Options> {
	output?: string;
	snapshot: string;
}

export type ValidTestCase<Options extends object | undefined> =
	| string
	| ValidTestCaseObject<Options>;

export type ValidTestCaseObject<Options extends object | undefined> =
	CommonTestCase<Options>;
