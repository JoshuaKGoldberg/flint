import { ruleTester } from "./ruleTester.js";
import rule from "./undefinedInitialValues.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
let value = undefined;
`,
			snapshot: `
let value = undefined;
          ~~~~~~~~~~~
          Variables should not be explicitly initialized to undefined.
`,
			suggestions: [
				{
					id: "removeUndefinedInit",
					updated: `
let value ;
`,
				},
			],
		},
		{
			code: `
var count = undefined;
`,
			snapshot: `
var count = undefined;
          ~~~~~~~~~~~
          Variables should not be explicitly initialized to undefined.
`,
			suggestions: [
				{
					id: "removeUndefinedInit",
					updated: `
var count ;
`,
				},
			],
		},
		{
			code: `
let first = undefined, second = 2;
`,
			snapshot: `
let first = undefined, second = 2;
          ~~~~~~~~~~~
          Variables should not be explicitly initialized to undefined.
`,
			suggestions: [
				{
					id: "removeUndefinedInit",
					updated: `
let first , second = 2;
`,
				},
			],
		},
		{
			code: `
let first = 1, second = undefined;
`,
			snapshot: `
let first = 1, second = undefined;
                      ~~~~~~~~~~~
                      Variables should not be explicitly initialized to undefined.
`,
			suggestions: [
				{
					id: "removeUndefinedInit",
					updated: `
let first = 1, second ;
`,
				},
			],
		},
		{
			code: `
function example() {
	let local = undefined;
}
`,
			snapshot: `
function example() {
	let local = undefined;
           ~~~~~~~~~~~
           Variables should not be explicitly initialized to undefined.
}
`,
			suggestions: [
				{
					id: "removeUndefinedInit",
					updated: `
function example() {
	let local ;
}
`,
				},
			],
		},
	],
	valid: [
		`let value;`,
		`var count;`,
		`let value = null;`,
		`let value = 0;`,
		`let value = "";`,
		`let value = false;`,
		`const value = undefined;`,
		`let value = getValue();`,
		`let first, second;`,
		`let first = 1, second = 2;`,
	],
});
