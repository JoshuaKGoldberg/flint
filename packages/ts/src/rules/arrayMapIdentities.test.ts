import rule from "./arrayMapIdentities.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const values: number[][] = [[1], [2], [3]];
const flat = values.flatMap((value) => value);
`,
			output: `
const values: number[][] = [[1], [2], [3]];
const flat = values.flat();
`,
			snapshot: `
const values: number[][] = [[1], [2], [3]];
const flat = values.flatMap((value) => value);
                    ~~~~~~~~~~~~~~~~~~~~~~~~~
                    Use \`.flat()\` instead of \`.flatMap()\` with an identity callback.
`,
		},
		{
			code: `
const items: string[][] = [["a"], ["b"]];
const flat = items.flatMap((item) => { return item; });
`,
			output: `
const items: string[][] = [["a"], ["b"]];
const flat = items.flat();
`,
			snapshot: `
const items: string[][] = [["a"], ["b"]];
const flat = items.flatMap((item) => { return item; });
                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                   Use \`.flat()\` instead of \`.flatMap()\` with an identity callback.
`,
		},
		{
			code: `
const nested: number[][] = [[1, 2], [3, 4]];
const flat = nested.flatMap(function (element) { return element; });
`,
			output: `
const nested: number[][] = [[1, 2], [3, 4]];
const flat = nested.flat();
`,
			snapshot: `
const nested: number[][] = [[1, 2], [3, 4]];
const flat = nested.flatMap(function (element) { return element; });
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    Use \`.flat()\` instead of \`.flatMap()\` with an identity callback.
`,
		},
		{
			code: `
const data: number[][] = [[1], [2]];
data.flatMap(x => x);
`,
			output: `
const data: number[][] = [[1], [2]];
data.flat();
`,
			snapshot: `
const data: number[][] = [[1], [2]];
data.flatMap(x => x);
     ~~~~~~~~~~~~~~~
     Use \`.flat()\` instead of \`.flatMap()\` with an identity callback.
`,
		},
	],
	valid: [
		`const values: number[][] = [[1], [2]]; const flat = values.flat();`,
		`const values: number[] = [1, 2, 3]; const doubled = values.flatMap((value) => [value, value]);`,
		`const values: number[][] = [[1], [2]]; const filtered = values.flatMap((value) => value.length > 0 ? value : []);`,
		`const values: number[][] = [[1], [2]]; const mapped = values.flatMap((value) => value.map((v) => v * 2));`,
		`const values: number[][] = [[1], [2]]; const mapped = values.map((value) => value);`,
		`const str = "a,b,c"; const parts = str.split(",").flatMap((part) => [part]);`,
		`const values: number[][] = [[1], [2]]; const flat = values.flatMap((a, b) => a);`,
		`const values: number[][] = [[1], [2]]; values.flatMap((value) => { doSomething(value); return value; });`,
		`const values: number[][] = [[1], [2]]; values.flatMap((value) => { if (!value) return []; return value; });`,
		`const values: number[][] = [[1], [2]]; values.flatMap((value) => { return value && value; });`,
		`const values: number[][] = [[1], [2]]; values.flatMap(function (value) { if (value.length > 0) { return value; } return []; });`,
		`const values: number[][] = [[1], [2]]; values.flatMap(({ length }) => length > 0 ? [[length]] : []);`,
	],
});
