import rule from "./directivePairs.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
// flint-disable someRule
const value = 1;
`,
			snapshot: `
// flint-disable someRule
~~~~~~~~~~~~~~~~~~~~~~~~~
This flint-disable directive is missing a corresponding flint-enable.
const value = 1;
`,
		},
		{
			code: `
// flint-disable
const value = 1;
`,
			snapshot: `
// flint-disable
~~~~~~~~~~~~~~~~
This flint-disable directive is missing a corresponding flint-enable.
const value = 1;
`,
		},
	],
	valid: [
		`// flint-disable someRule
const value = 1;
// flint-enable someRule`,
		`// flint-disable
const value = 1;
// flint-enable`,
		`// flint-disable-next-line someRule
const value = 1;`,
		"const value = 1;",
	],
});
