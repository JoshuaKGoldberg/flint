import rule from "./arrayExistenceChecksConsistency.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
declare const array: string[];
const index = array.indexOf("value");
if (index < 0) {}
`,
			snapshot: `
declare const array: string[];
const index = array.indexOf("value");
if (index < 0) {}
    ~~~~~~~~~
    Prefer \`=== -1\` over \`< 0\` for checking existence.
`,
		},
		{
			code: `
declare const array: string[];
const index = array.indexOf("value");
if (index >= 0) {}
`,
			snapshot: `
declare const array: string[];
const index = array.indexOf("value");
if (index >= 0) {}
    ~~~~~~~~~~
    Prefer \`!== -1\` over \`>= 0\` for checking existence.
`,
		},
		{
			code: `
declare const array: string[];
const index = array.indexOf("value");
if (index > -1) {}
`,
			snapshot: `
declare const array: string[];
const index = array.indexOf("value");
if (index > -1) {}
    ~~~~~~~~~~
    Prefer \`!== -1\` over \`> -1\` for checking existence.
`,
		},
		{
			code: `
declare const array: number[];
const index = array.findIndex((value) => value > 10);
if (index < 0) {}
`,
			snapshot: `
declare const array: number[];
const index = array.findIndex((value) => value > 10);
if (index < 0) {}
    ~~~~~~~~~
    Prefer \`=== -1\` over \`< 0\` for checking existence.
`,
		},
		{
			code: `
declare const text: string;
const index = text.lastIndexOf("needle");
if (index >= 0) {}
`,
			snapshot: `
declare const text: string;
const index = text.lastIndexOf("needle");
if (index >= 0) {}
    ~~~~~~~~~~
    Prefer \`!== -1\` over \`>= 0\` for checking existence.
`,
		},
		{
			code: `
declare const array: number[];
const index = array.findLastIndex((value) => value < 0);
if (index > -1) {}
`,
			snapshot: `
declare const array: number[];
const index = array.findLastIndex((value) => value < 0);
if (index > -1) {}
    ~~~~~~~~~~
    Prefer \`!== -1\` over \`> -1\` for checking existence.
`,
		},
	],
	valid: [
		`
declare const array: string[];
const index = array.indexOf("value");
if (index === -1) {}
`,
		`
declare const array: string[];
const index = array.indexOf("value");
if (index !== -1) {}
`,
		`
declare const array: number[];
const index = array.findIndex((value) => value > 10);
if (index === -1) {}
`,
		`
declare const array: number[];
let index = array.indexOf("value");
if (index < 0) {}
`,
		`
declare const array: number[];
const index = 0;
if (index < 0) {}
`,
		`
declare const index: number;
if (index >= 0) {}
`,
		`
declare const array: string[];
const index = array.indexOf("value");
if (index > 0) {}
`,
		`
declare const array: string[];
const index = array.indexOf("value");
if (index < 10) {}
`,
	],
});
