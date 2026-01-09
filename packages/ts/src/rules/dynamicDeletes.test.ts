import rule from "./dynamicDeletes.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const key = "property";
delete obj[key];
`,
			snapshot: `
const key = "property";
delete obj[key];
~~~~~~~~~~~~~~~
Avoid using delete on computed key expressions.
`,
		},
		{
			code: `
delete obj[getKey()];
`,
			snapshot: `
delete obj[getKey()];
~~~~~~~~~~~~~~~~~~~~
Avoid using delete on computed key expressions.
`,
		},
		{
			code: `
const i = 0;
delete arr[i];
`,
			snapshot: `
const i = 0;
delete arr[i];
~~~~~~~~~~~~~
Avoid using delete on computed key expressions.
`,
		},
	],
	valid: [
		"delete obj.property;",
		"delete obj['literal'];",
		"delete obj[0];",
		"const obj = { a: 1 }; delete obj.a;",
	],
});
