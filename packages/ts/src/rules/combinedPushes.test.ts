import rule from "./combinedPushes.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const arr: number[] = [];
arr.push(1);
arr.push(2);
`,
			snapshot: `
const arr: number[] = [];
arr.push(1);
~~~~~~~~~~~~
arr.push(2);
~~~~~~~~~~~~
Consecutive \`.push()\` calls can be combined into a single call.
`,
		},
		{
			code: `
const items: string[] = [];
items.push("a");
items.push("b");
items.push("c");
`,
			snapshot: `
const items: string[] = [];
items.push("a");
~~~~~~~~~~~~~~~~
items.push("b");
~~~~~~~~~~~~~~~~
Consecutive \`.push()\` calls can be combined into a single call.
items.push("b");
~~~~~~~~~~~~~~~~
items.push("c");
~~~~~~~~~~~~~~~~
Consecutive \`.push()\` calls can be combined into a single call.
`,
		},
		{
			code: `
function test() {
	const arr: number[] = [];
	arr.push(1);
	arr.push(2);
}
`,
			snapshot: `
function test() {
	const arr: number[] = [];
	arr.push(1);
	~~~~~~~~~~~~
	arr.push(2);
	~~~~~~~~~~~~
	Consecutive \`.push()\` calls can be combined into a single call.
}
`,
		},
		{
			code: `
const arr: number[] = [];
arr.push(1, 2);
arr.push(3);
`,
			snapshot: `
const arr: number[] = [];
arr.push(1, 2);
~~~~~~~~~~~~~~~
arr.push(3);
~~~~~~~~~~~~
Consecutive \`.push()\` calls can be combined into a single call.
`,
		},
	],
	valid: [
		`const arr: number[] = []; arr.push(1);`,
		`const arr: number[] = []; arr.push(1, 2, 3);`,
		`
const arr: number[] = [];
arr.push(1);
console.log("something");
arr.push(2);
`,
		`
const arr1: number[] = [];
const arr2: number[] = [];
arr1.push(1);
arr2.push(2);
`,
		`
const obj = { push: (x: number) => x };
obj.push(1);
obj.push(2);
`,
		`
const arr: number[] = [];
arr.push(1);
const x = 1;
arr.push(2);
`,
	],
});
