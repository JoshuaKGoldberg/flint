import { expect } from "vitest";

import rule from "./keyDuplicates.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
{
  "a": "first",
  "a": "second",
}
`,
			snapshot: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					{
					  "a": "first",
					  ~~~
					  This key is made redundant by an identical key later in the object.
					  "a": "second",
					}
					"
				`);
			},
		},
		{
			code: `
{
  "a": "first",
  "a": "second",
}
`,
			options: {
				allowKeys: ["//"],
			},
			snapshot: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					{
					  "a": "first",
					  ~~~
					  This key is made redundant by an identical key later in the object.
					  "a": "second",
					}
					"
				`);
			},
		},
	],
	valid: [
		`{}`,
		`{ "a": "apple" }`,
		`
{
  "a": "first",
  "b": "second",
}
`,
		{
			code: `
{
  "//": "first",
  "//": "second",
}`,
			options: {
				allowKeys: ["//"],
			},
		},
	],
});
