import rule from "./arrayMutableSorts.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const values: number[] = [3, 1, 2];
const sorted = values.sort();
`,
			output: `
const values: number[] = [3, 1, 2];
const sorted = values.toSorted();
`,
			snapshot: `
const values: number[] = [3, 1, 2];
const sorted = values.sort();
                      ~~~~~~
                      Use \`.toSorted()\` instead of \`.sort()\` to avoid mutating the original array.
`,
		},
		{
			code: `
const items: number[] = [3, 1, 2];
const sorted = items.sort((a, b) => a - b);
`,
			output: `
const items: number[] = [3, 1, 2];
const sorted = items.toSorted((a, b) => a - b);
`,
			snapshot: `
const items: number[] = [3, 1, 2];
const sorted = items.sort((a, b) => a - b);
                     ~~~~~~~~~~~~~~~~~~~~~
                     Use \`.toSorted()\` instead of \`.sort()\` to avoid mutating the original array.
`,
		},
		{
			code: `
const data: string[] = ["c", "a", "b"];
doSomething(data.sort());
`,
			output: `
const data: string[] = ["c", "a", "b"];
doSomething(data.toSorted());
`,
			snapshot: `
const data: string[] = ["c", "a", "b"];
doSomething(data.sort());
                 ~~~~~~
                 Use \`.toSorted()\` instead of \`.sort()\` to avoid mutating the original array.
`,
		},
		{
			code: `
const values: number[] = [3, 1, 2];
const result = [...values].sort();
`,
			output: `
const values: number[] = [3, 1, 2];
const result = [...values].toSorted();
`,
			snapshot: `
const values: number[] = [3, 1, 2];
const result = [...values].sort();
                           ~~~~~~
                           Use \`.toSorted()\` instead of \`.sort()\` to avoid mutating the original array.
`,
		},
		{
			code: `
const values: number[] = [3, 1, 2];
return values.sort();
`,
			output: `
const values: number[] = [3, 1, 2];
return values.toSorted();
`,
			snapshot: `
const values: number[] = [3, 1, 2];
return values.sort();
              ~~~~~~
              Use \`.toSorted()\` instead of \`.sort()\` to avoid mutating the original array.
`,
		},
	],
	valid: [
		`const values: number[] = [3, 1, 2]; const sorted = values.toSorted();`,
		`const values: number[] = [3, 1, 2]; values.sort();`,
		`const values: number[] = [3, 1, 2]; values.sort(); doSomething(values);`,
		`const obj = { sort: () => "test" }; const result = obj.sort();`,
		`function test(arr: number[]) { arr.sort(); }`,
		`const values: number[] = [3, 1, 2]; values.sort((a, b) => a - b);`,
	],
});
