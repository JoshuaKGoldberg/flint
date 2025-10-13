import { ruleTester } from "./ruleTester.js";
import rule from "./unicodeBOMs.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `\uFEFFconst value = 1;
`,
			snapshot: `\uFEFFconst value = 1;
~
This Unicode Byte Order Mark (BOM) is unnecessary and can cause issues with some tools.
`,
			suggestions: [
				{
					id: "removeBOM",
					updated: `const value = 1;
`,
				},
			],
		},
		{
			code: `\uFEFF// Comment
const value = 1;
`,
			snapshot: `\uFEFF// Comment
~
This Unicode Byte Order Mark (BOM) is unnecessary and can cause issues with some tools.
const value = 1;
`,
			suggestions: [
				{
					id: "removeBOM",
					updated: `// Comment
const value = 1;
`,
				},
			],
		},
		{
			code: `\uFEFF
const value = 1;
`,
			snapshot: `\uFEFF
~
This Unicode Byte Order Mark (BOM) is unnecessary and can cause issues with some tools.
const value = 1;
`,
			suggestions: [
				{
					id: "removeBOM",
					updated: `
const value = 1;
`,
				},
			],
		},
	],
	valid: [
		`const value = 1;`,
		`// Comment at the start
const value = 1;`,
		`
const value = 1;`,
		`function test() { return 42; }`,
	],
});
