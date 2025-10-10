import rule from "./functionNewCalls.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const fn = new Function("a", "b", "return a + b");
`,
			snapshot: `
const fn = new Function("a", "b", "return a + b");
               ~~~~~~~~
               Prefer function declarations or arrow functions over the Function constructor.
`,
		},
		{
			code: `
const fn = Function("a", "return a");
`,
			snapshot: `
const fn = Function("a", "return a");
           ~~~~~~~~
           Prefer function declarations or arrow functions over the Function constructor.
`,
		},
		{
			code: `
const fn = new Function("return 1");
`,
			snapshot: `
const fn = new Function("return 1");
               ~~~~~~~~
               Prefer function declarations or arrow functions over the Function constructor.
`,
		},
		{
			code: `
const fn = Function();
`,
			snapshot: `
const fn = Function();
           ~~~~~~~~
           Prefer function declarations or arrow functions over the Function constructor.
`,
		},
		{
			code: `
const fn = new globalThis.Function("return 1");
`,
			snapshot: `
const fn = new globalThis.Function("return 1");
               ~~~~~~~~~~~~~~~~~~~
               Prefer function declarations or arrow functions over the Function constructor.
`,
		},
		{
			code: `
const fn = globalThis.Function("return 1");
`,
			snapshot: `
const fn = globalThis.Function("return 1");
           ~~~~~~~~~~~~~~~~~~~
           Prefer function declarations or arrow functions over the Function constructor.
`,
		},
		{
			code: `
const fn = new window.Function("return 1");
`,
			snapshot: `
const fn = new window.Function("return 1");
               ~~~~~~~~~~~~~~~
               Prefer function declarations or arrow functions over the Function constructor.
`,
		},
		{
			code: `
const fn = window.Function("return 1");
`,
			snapshot: `
const fn = window.Function("return 1");
           ~~~~~~~~~~~~~~~
           Prefer function declarations or arrow functions over the Function constructor.
`,
		},
		{
			code: `
const result = new Function("a", "b", "return a + b")(1, 2);
`,
			snapshot: `
const result = new Function("a", "b", "return a + b")(1, 2);
                   ~~~~~~~~
                   Prefer function declarations or arrow functions over the Function constructor.
`,
		},
	],
	valid: [
		`const fn = function(a, b) { return a + b; };`,
		`const fn = (a, b) => a + b;`,
		`function add(a, b) { return a + b; }`,
		`class MyFunction {}`,
		`const fn = new MyFunction();`,
		`const CustomFunction = Function; const fn = new CustomFunction();`,
	],
});
