import rule from "./combinedPushes.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const arr = [];
arr.push(1);
arr.push(2);
`,
			snapshot: `
const arr = [];
arr.push(1);
~~~~~~~~~~~~
Multiple consecutive \`push()\` calls can be combined into one.
arr.push(2);
~~~~~~~~~~~~
`,
		},
		{
			code: `
const items = [];
items.push("a");
items.push("b");
items.push("c");
`,
			snapshot: `
const items = [];
items.push("a");
~~~~~~~~~~~~~~~~
Multiple consecutive \`push()\` calls can be combined into one.
items.push("b");
~~~~~~~~~~~~~~~~
items.push("c");
~~~~~~~~~~~~~~~~
`,
		},
		{
			code: `
const list = [];
list.push(1);
list.push(2);
const other = 5;
`,
			snapshot: `
const list = [];
list.push(1);
~~~~~~~~~~~~~
Multiple consecutive \`push()\` calls can be combined into one.
list.push(2);
~~~~~~~~~~~~~
const other = 5;
`,
		},
	],
	valid: [
		`const arr = []; arr.push(1);`,
		`
const arr = [];
arr.push(1);
arr.pop();
arr.push(2);
`,
		`
const arr = [];
const obj = {};
arr.push(1);
obj.push(2);
`,
		`
const arr = [];
arr.push(1);
// comment
arr.push(2);
`,
	],
});
