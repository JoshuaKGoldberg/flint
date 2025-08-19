import { TestCase } from "./types.js";

export interface TestCaseNormalized extends TestCase {
	fileName: string;
}

export function normalizeTestCase<T extends TestCase>(
	testCase: T,
): T & TestCaseNormalized {
	return {
		fileName: "file.ts",
		...testCase,
	};
}
