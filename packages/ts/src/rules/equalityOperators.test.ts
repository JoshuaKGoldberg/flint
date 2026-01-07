import rule from "./equalityOperators.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
if (value == other) {}
`,
			snapshot: `
if (value == other) {}
          ~~
          Use \`===\` instead of \`==\`.
`,
			suggestions: [
				{
					id: "useStrictEquality",
					updated: `
if (value === other) {}
`,
				},
			],
		},
		{
			code: `
if (value != other) {}
`,
			snapshot: `
if (value != other) {}
          ~~
          Use \`!==\` instead of \`!=\`.
`,
			suggestions: [
				{
					id: "useStrictEquality",
					updated: `
if (value !== other) {}
`,
				},
			],
		},
		{
			code: `
const result = input == expected;
`,
			snapshot: `
const result = input == expected;
                     ~~
                     Use \`===\` instead of \`==\`.
`,
			suggestions: [
				{
					id: "useStrictEquality",
					updated: `
const result = input === expected;
`,
				},
			],
		},
		{
			code: `
while (count != limit) {}
`,
			snapshot: `
while (count != limit) {}
             ~~
             Use \`!==\` instead of \`!=\`.
`,
			suggestions: [
				{
					id: "useStrictEquality",
					updated: `
while (count !== limit) {}
`,
				},
			],
		},
		{
			code: `
const check = value == undefined;
`,
			snapshot: `
const check = value == undefined;
                    ~~
                    Use \`===\` instead of \`==\`.
`,
			suggestions: [
				{
					id: "useStrictEquality",
					updated: `
const check = value === undefined;
`,
				},
			],
		},
	],
	valid: [
		`if (value === other) {}`,
		`if (value !== other) {}`,
		`const result = input === expected;`,
		`while (count !== limit) {}`,
		`if (value == null) {}`,
		`if (null == value) {}`,
		`if (value != null) {}`,
		`if (typeof value == "string") {}`,
		`if ("number" == typeof value) {}`,
		`if (typeof value != "undefined") {}`,
		`if (1 == 1) {}`,
		`if ("a" == "b") {}`,
		`if (true == false) {}`,
	],
});
