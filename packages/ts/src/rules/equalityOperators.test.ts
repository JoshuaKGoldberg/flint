import rule from "./equalityOperators.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
declare const value: string;
declare const other: string;
if (value == other) {}
`,
			snapshot: `
declare const value: string;
declare const other: string;
if (value == other) {}
          ~~
          Use \`===\` instead of \`==\`.
`,
			suggestions: [
				{
					id: "useStrictEquality",
					updated: `
declare const value: string;
declare const other: string;
if (value === other) {}
`,
				},
			],
		},
		{
			code: `
declare const value: string;
declare const other: string;
if (value != other) {}
`,
			snapshot: `
declare const value: string;
declare const other: string;
if (value != other) {}
          ~~
          Use \`!==\` instead of \`!=\`.
`,
			suggestions: [
				{
					id: "useStrictEquality",
					updated: `
declare const value: string;
declare const other: string;
if (value !== other) {}
`,
				},
			],
		},
		{
			code: `
declare const input: number;
declare const expected: number;
const result = input == expected;
`,
			snapshot: `
declare const input: number;
declare const expected: number;
const result = input == expected;
                     ~~
                     Use \`===\` instead of \`==\`.
`,
			suggestions: [
				{
					id: "useStrictEquality",
					updated: `
declare const input: number;
declare const expected: number;
const result = input === expected;
`,
				},
			],
		},
		{
			code: `
declare const count: number;
declare const limit: number;
while (count != limit) {}
`,
			snapshot: `
declare const count: number;
declare const limit: number;
while (count != limit) {}
             ~~
             Use \`!==\` instead of \`!=\`.
`,
			suggestions: [
				{
					id: "useStrictEquality",
					updated: `
declare const count: number;
declare const limit: number;
while (count !== limit) {}
`,
				},
			],
		},
		{
			code: `
declare const value: string;
const check = value == undefined;
`,
			snapshot: `
declare const value: string;
const check = value == undefined;
                    ~~
                    Use \`===\` instead of \`==\`.
`,
			suggestions: [
				{
					id: "useStrictEquality",
					updated: `
declare const value: string;
const check = value === undefined;
`,
				},
			],
		},
		{
			code: `
declare const value: string;
const check = undefined == value;
`,
			snapshot: `
declare const value: string;
const check = undefined == value;
                        ~~
                        Use \`===\` instead of \`==\`.
`,
			suggestions: [
				{
					id: "useStrictEquality",
					updated: `
declare const value: string;
const check = undefined === value;
`,
				},
			],
		},
	],
	valid: [
		`declare const value: string; declare const other: string; if (value === other) {}`,
		`declare const value: string; declare const other: string; if (value !== other) {}`,
		`declare const input: number; declare const expected: number; const result = input === expected;`,
		`declare const count: number; declare const limit: number; while (count !== limit) {}`,
		`declare const value: string; if (value == null) {}`,
		`declare const value: string; if (null == value) {}`,
		`declare const value: string; if (value != null) {}`,
		`declare const value: unknown; if (typeof value == "string") {}`,
		`declare const value: unknown; if ("number" == typeof value) {}`,
		`declare const value: unknown; if (typeof value != "undefined") {}`,
		`if (1 == 1) {}`,
		`if ("a" == "b") {}`,
		`if (true == false) {}`,
		`declare const value: string | null; if (value == undefined) {}`,
		`declare const value: string | undefined; if (value == undefined) {}`,
		`declare const value: string | null | undefined; if (value == undefined) {}`,
		`declare const value: string | null; if (undefined == value) {}`,
		`declare const value: string | undefined; if (value != undefined) {}`,
		`declare const value: string | null; if (value == null) {}`,
	],
});
