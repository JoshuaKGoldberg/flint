import rule from "./duplicateKeys.js";
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
			snapshot: `
{
  "a": "first",
  ~~~
  This key is made redundant by an identical key later in the object.
  "a": "second",
}
`,
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
	],
});
