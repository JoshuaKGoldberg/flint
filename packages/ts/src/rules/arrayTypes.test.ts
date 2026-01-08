import rule from "./arrayTypes.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const values: Array<string> = [];
`,
			snapshot: `
const values: Array<string> = [];
              ~~~~~~~~~~~~~
              Prefer \`T[]\` over \`Array<T>\`.
`,
		},
		{
			code: `
function process(items: Array<number>): void {}
`,
			snapshot: `
function process(items: Array<number>): void {}
                        ~~~~~~~~~~~~~
                        Prefer \`T[]\` over \`Array<T>\`.
`,
		},
		{
			code: `
type StringArray = Array<string>;
`,
			snapshot: `
type StringArray = Array<string>;
                   ~~~~~~~~~~~~~
                   Prefer \`T[]\` over \`Array<T>\`.
`,
		},
		{
			code: `
const values: ReadonlyArray<string> = [];
`,
			snapshot: `
const values: ReadonlyArray<string> = [];
              ~~~~~~~~~~~~~~~~~~~~~
              Prefer \`readonly T[]\` over \`ReadonlyArray<T>\`.
`,
		},
		{
			code: `
function process(items: ReadonlyArray<number>): void {}
`,
			snapshot: `
function process(items: ReadonlyArray<number>): void {}
                        ~~~~~~~~~~~~~~~~~~~~~
                        Prefer \`readonly T[]\` over \`ReadonlyArray<T>\`.
`,
		},
	],
	valid: [
		`const values: string[] = [];`,
		`function process(items: number[]): void {}`,
		`type StringArray = string[];`,
		`const values: readonly string[] = [];`,
		`function process(items: readonly number[]): void {}`,
		`const map: Map<string, number> = new Map();`,
		`const set: Set<string> = new Set();`,
	],
});
