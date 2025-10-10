import rule from "./newNativeNonConstructors.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
new Symbol("description");
`,
			snapshot: `
new Symbol("description");
~~~
Prefer calling Symbol directly over using \`new\` with Symbol.
`,
			suggestions: [
				{
					id: "removeNew",
					updated: `
Symbol("description");
`,
				},
			],
		},
		{
			code: `
new BigInt(42);
`,
			snapshot: `
new BigInt(42);
~~~
Prefer calling BigInt directly over using \`new\` with BigInt.
`,
			suggestions: [
				{
					id: "removeNew",
					updated: `
BigInt(42);
`,
				},
			],
		},
		{
			code: `
const value = new Symbol();
`,
			snapshot: `
const value = new Symbol();
              ~~~
              Prefer calling Symbol directly over using \`new\` with Symbol.
`,
			suggestions: [
				{
					id: "removeNew",
					updated: `
const value = Symbol();
`,
				},
			],
		},
		{
			code: `
function create() {
    return new BigInt(100);
}
`,
			snapshot: `
function create() {
    return new BigInt(100);
           ~~~
           Prefer calling BigInt directly over using \`new\` with BigInt.
}
`,
			suggestions: [
				{
					id: "removeNew",
					updated: `
function create() {
    return BigInt(100);
}
`,
				},
			],
		},
		{
			code: `
const symbols = [new Symbol("a"), new Symbol("b")];
`,
			snapshot: `
const symbols = [new Symbol("a"), new Symbol("b")];
                 ~~~
                 Prefer calling Symbol directly over using \`new\` with Symbol.
                                  ~~~
                                  Prefer calling Symbol directly over using \`new\` with Symbol.
`,
			suggestions: [
				{
					id: "removeNew",
					updated: `
const symbols = [Symbol("a"), new Symbol("b")];
`,
				},
				{
					id: "removeNew",
					updated: `
const symbols = [new Symbol("a"), Symbol("b")];
`,
				},
			],
		},
	],
	valid: [
		`Symbol("description");`,
		`BigInt(42);`,
		`const value = Symbol();`,
		`const number = BigInt(100);`,
		`function create() { return Symbol("key"); }`,
		`const array = [Symbol("a"), Symbol("b")];`,
		`new String("text");`,
		`new Number(42);`,
		`new Boolean(true);`,
		`new Object();`,
		`new Array();`,
		`new Date();`,
		`new Error("message");`,
		`new Map();`,
		`new Set();`,
		`new Promise((resolve) => resolve());`,
		`new WeakMap();`,
		`new WeakSet();`,
	],
});
