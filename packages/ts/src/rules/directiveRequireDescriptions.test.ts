import rule from "./directiveRequireDescriptions.ts";
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
Flint directive comments should include a description.
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
Flint directive comments should include a description.
const value = 1;
`,
		},
		{
			code: `
// flint-disable-next-line someRule
const value = 1;
`,
			snapshot: `
// flint-disable-next-line someRule
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Flint directive comments should include a description.
const value = 1;
`,
		},
	],
	valid: [
		"// flint-disable someRule -- This is needed for backwards compatibility\nconst value = 1;",
		"// flint-disable-next-line someRule -- Legacy API requires this\nconst value = 1;",
		"// flint-enable someRule\nconst value = 1;",
		"const value = 1;",
	],
});
