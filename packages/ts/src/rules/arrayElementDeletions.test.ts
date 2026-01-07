import rule from "./arrayElementDeletions.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
declare const array: number[];
delete array[0];
`,
			snapshot: `
declare const array: number[];
delete array[0];
~~~~~~~~~~~~~~~
Avoid using the \`delete\` operator on arrays.
`,
		},
		{
			code: `
declare const array: string[];
const index = 2;
delete array[index];
`,
			snapshot: `
declare const array: string[];
const index = 2;
delete array[index];
~~~~~~~~~~~~~~~~~~~
Avoid using the \`delete\` operator on arrays.
`,
		},
		{
			code: `
const items = [1, 2, 3];
delete items[1];
`,
			snapshot: `
const items = [1, 2, 3];
delete items[1];
~~~~~~~~~~~~~~~
Avoid using the \`delete\` operator on arrays.
`,
		},
		{
			code: `
declare const matrix: number[][];
delete matrix[0][1];
`,
			snapshot: `
declare const matrix: number[][];
delete matrix[0][1];
~~~~~~~~~~~~~~~~~~~
Avoid using the \`delete\` operator on arrays.
`,
		},
		{
			code: `
declare function getArray(): number[];
delete getArray()[0];
`,
			snapshot: `
declare function getArray(): number[];
delete getArray()[0];
~~~~~~~~~~~~~~~~~~~~
Avoid using the \`delete\` operator on arrays.
`,
		},
	],
	valid: [
		`
declare const obj: { [key: string]: number };
delete obj["key"];
`,
		`
declare const obj: Record<string, number>;
delete obj.property;
`,
		`
declare const map: Map<string, number>;
map.delete("key");
`,
		`
declare const array: number[];
array.splice(0, 1);
`,
		`
delete globalThis.myProperty;
`,
	],
});
