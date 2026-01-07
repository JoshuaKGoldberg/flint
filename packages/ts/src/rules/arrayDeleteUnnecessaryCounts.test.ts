import rule from "./arrayDeleteUnnecessaryCounts.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
declare const array: number[];
array.splice(1, array.length);
`,
			snapshot: `
declare const array: number[];
array.splice(1, array.length);
                ~~~~~~~~~~~~
                Passing \`array.length\` as the \`deleteCount\` argument is unnecessary.
`,
		},
		{
			code: `
declare const array: number[];
array.splice(0, Infinity);
`,
			snapshot: `
declare const array: number[];
array.splice(0, Infinity);
                ~~~~~~~~
                Passing \`Infinity\` as the \`deleteCount\` argument is unnecessary.
`,
		},
		{
			code: `
declare const array: number[];
array.splice(0, Number.POSITIVE_INFINITY);
`,
			snapshot: `
declare const array: number[];
array.splice(0, Number.POSITIVE_INFINITY);
                ~~~~~~~~~~~~~~~~~~~~~~~~
                Passing \`Number.POSITIVE_INFINITY\` as the \`deleteCount\` argument is unnecessary.
`,
		},
		{
			code: `
declare const array: number[];
array.toSpliced(1, array.length);
`,
			snapshot: `
declare const array: number[];
array.toSpliced(1, array.length);
                   ~~~~~~~~~~~~
                   Passing \`array.length\` as the \`skipCount\` argument is unnecessary.
`,
		},
		{
			code: `
declare const array: number[];
array.toSpliced(0, Infinity);
`,
			snapshot: `
declare const array: number[];
array.toSpliced(0, Infinity);
                   ~~~~~~~~
                   Passing \`Infinity\` as the \`skipCount\` argument is unnecessary.
`,
		},
		{
			code: `
declare const array: number[];
array?.splice(1, array.length);
`,
			snapshot: `
declare const array: number[];
array?.splice(1, array.length);
                 ~~~~~~~~~~~~
                 Passing \`array.length\` as the \`deleteCount\` argument is unnecessary.
`,
		},
		{
			code: `
declare const array: number[];
array.splice(1, ((array.length)));
`,
			snapshot: `
declare const array: number[];
array.splice(1, ((array.length)));
                ~~~~~~~~~~~~~~~~
                Passing \`array.length\` as the \`deleteCount\` argument is unnecessary.
`,
		},
		{
			code: `
declare const obj: { items: number[] };
obj.items.splice(1, obj.items.length);
`,
			snapshot: `
declare const obj: { items: number[] };
obj.items.splice(1, obj.items.length);
                    ~~~~~~~~~~~~~~~~
                    Passing \`….length\` as the \`deleteCount\` argument is unnecessary.
`,
		},
	],
	valid: [
		`
declare const array: number[];
array.splice(1);
`,
		`
declare const array: number[];
array.splice(1, 2);
`,
		`
declare const array: number[];
array.splice(1, array.length - 1);
`,
		`
declare const array: number[];
array.splice(1, array.length, "new");
`,
		`
declare const array: number[];
declare const other: number[];
array.splice(1, other.length);
`,
		`
declare const array: number[];
array.splice(array.length, 1);
`,
		`
declare const array: number[];
declare const length: number;
array.splice(1, length);
`,
		`
declare const array: number[];
splice(1, array.length);
`,
		`const result = [1, 2, 3].slice(1);`,
	],
});
