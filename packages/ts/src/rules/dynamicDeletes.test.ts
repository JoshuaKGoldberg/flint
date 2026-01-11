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
Using the \`delete\` operator on a computed key can be dangerous and is often not well optimized.
`,
		},
		{
			code: `
delete obj[getKey()];
`,
			snapshot: `
delete obj[getKey()];
~~~~~~~~~~~~~~~~~~~~
Using the \`delete\` operator on a computed key can be dangerous and is often not well optimized.
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
Using the \`delete\` operator on a computed key can be dangerous and is often not well optimized.
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
