import { describe, it } from "vitest";

import { RuleTester } from "../testing/RuleTester.js";
import rule from "./forInArrays.js";

const ruleTester = new RuleTester({
	describe,
	it,
});

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
declare const array: string[];
for (const i in array) {}
`,
			snapshot: `
declare const array: string[];
for (const i in array) {}
~~~~~~~~~~~~~~~~~~~~~~
Avoid using for-in loops over arrays, as they have surprising behavior that often leads to bugs.
`,
		},
	],
	valid: [
		`
declare const array: string[];
for (const i of array) {}
`,
	],
});
