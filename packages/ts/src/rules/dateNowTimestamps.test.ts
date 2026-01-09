import rule from "./dateNowTimestamps.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const timestamp = new Date().getTime();
`,
			snapshot: `
const timestamp = new Date().getTime();
                  ~~~~~~~~~~~~~~~~~~~~
                  Use Date.now() to get the current timestamp.
`,
		},
		{
			code: `
const timestamp = new Date().valueOf();
`,
			snapshot: `
const timestamp = new Date().valueOf();
                  ~~~~~~~~~~~~~~~~~~~~
                  Use Date.now() to get the current timestamp.
`,
		},
		{
			code: `
const timestamp = +new Date();
`,
			snapshot: `
const timestamp = +new Date();
                   ~~~~~~~~~~
                   Use Date.now() to get the current timestamp.
`,
		},
		{
			code: `
const timestamp = Number(new Date());
`,
			snapshot: `
const timestamp = Number(new Date());
                  ~~~~~~~~~~~~~~~~~~
                  Use Date.now() to get the current timestamp.
`,
		},
	],
	valid: [
		"const timestamp = Date.now();",
		"const date = new Date();",
		"const time = date.getTime();",
		"const timestamp = new Date(2024, 0, 1).getTime();",
		"const value = new Date().toISOString();",
		"const value = String(new Date());",
	],
});
