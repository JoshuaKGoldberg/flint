import rule from "./arrayIncludes.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
declare const array: number[];
declare const value: number;
array.indexOf(value) !== -1;
`,
			snapshot: `
declare const array: number[];
declare const value: number;
array.indexOf(value) !== -1;
~~~~~~~~~~~~~~~~~~~~~~~~~~~
Prefer \`.includes()\` over \`.indexOf()\` comparison.
`,
		},
		{
			code: `
declare const array: string[];
declare const value: string;
array.indexOf(value) === -1;
`,
			snapshot: `
declare const array: string[];
declare const value: string;
array.indexOf(value) === -1;
~~~~~~~~~~~~~~~~~~~~~~~~~~~
Prefer \`.includes()\` over \`.indexOf()\` comparison.
`,
		},
		{
			code: `
declare const array: number[];
declare const value: number;
array.indexOf(value) > -1;
`,
			snapshot: `
declare const array: number[];
declare const value: number;
array.indexOf(value) > -1;
~~~~~~~~~~~~~~~~~~~~~~~~~
Prefer \`.includes()\` over \`.indexOf()\` comparison.
`,
		},
		{
			code: `
declare const array: number[];
declare const value: number;
array.indexOf(value) >= 0;
`,
			snapshot: `
declare const array: number[];
declare const value: number;
array.indexOf(value) >= 0;
~~~~~~~~~~~~~~~~~~~~~~~~~
Prefer \`.includes()\` over \`.indexOf()\` comparison.
`,
		},
		{
			code: `
declare const str: string;
str.indexOf("test") !== -1;
`,
			snapshot: `
declare const str: string;
str.indexOf("test") !== -1;
~~~~~~~~~~~~~~~~~~~~~~~~~~
Prefer \`.includes()\` over \`.indexOf()\` comparison.
`,
		},
		{
			code: `
declare const array: ReadonlyArray<number>;
declare const value: number;
array.indexOf(value) !== -1;
`,
			snapshot: `
declare const array: ReadonlyArray<number>;
declare const value: number;
array.indexOf(value) !== -1;
~~~~~~~~~~~~~~~~~~~~~~~~~~~
Prefer \`.includes()\` over \`.indexOf()\` comparison.
`,
		},
		{
			code: `
declare const value: number;
-1 !== [1, 2, 3].indexOf(value);
`,
			snapshot: `
declare const value: number;
-1 !== [1, 2, 3].indexOf(value);
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Prefer \`.includes()\` over \`.indexOf()\` comparison.
`,
		},
		{
			code: `
function check<T extends number[]>(arr: T, value: number) {
	return arr.indexOf(value) !== -1;
}
`,
			snapshot: `
function check<T extends number[]>(arr: T, value: number) {
	return arr.indexOf(value) !== -1;
	       ~~~~~~~~~~~~~~~~~~~~~~~~~
	       Prefer \`.includes()\` over \`.indexOf()\` comparison.
}
`,
		},
	],
	valid: [
		`declare const array: number[]; declare const value: number; array.includes(value);`,
		`declare const str: string; str.includes("test");`,
		`declare const array: number[]; declare const value: number; array.indexOf(value);`,
		`declare const array: number[]; declare const value: number; array.indexOf(value) === 0;`,
		`declare const array: number[]; declare const value: number; array.indexOf(value) > 0;`,
		`declare const obj: { indexOf(x: number): number }; obj.indexOf(1) !== -1;`,
	],
});
