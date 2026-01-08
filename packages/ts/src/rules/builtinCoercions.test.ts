import rule from "./builtinCoercions.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const toBoolean = (value: unknown) => Boolean(value);
`,
			snapshot: `
const toBoolean = (value: unknown) => Boolean(value);
                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                  Use Boolean directly instead of wrapping it in a function.
`,
		},
		{
			code: `
const toString = (value: unknown) => String(value);
`,
			snapshot: `
const toString = (value: unknown) => String(value);
                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                 Use String directly instead of wrapping it in a function.
`,
		},
		{
			code: `
const toNumber = (value: unknown) => Number(value);
`,
			snapshot: `
const toNumber = (value: unknown) => Number(value);
                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                 Use Number directly instead of wrapping it in a function.
`,
		},
		{
			code: `
const toBigInt = (value: bigint) => BigInt(value);
`,
			snapshot: `
const toBigInt = (value: bigint) => BigInt(value);
                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                 Use BigInt directly instead of wrapping it in a function.
`,
		},
		{
			code: `
const toSymbol = (value: string) => Symbol(value);
`,
			snapshot: `
const toSymbol = (value: string) => Symbol(value);
                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                 Use Symbol directly instead of wrapping it in a function.
`,
		},
		{
			code: `
const toBoolean = function(value: unknown) { return Boolean(value); };
`,
			snapshot: `
const toBoolean = function(value: unknown) { return Boolean(value); };
                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                  Use Boolean directly instead of wrapping it in a function.
`,
		},
		{
			code: `
const identity = (element: unknown) => element;
`,
			snapshot: `
const identity = (element: unknown) => element;
                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                 Use Boolean directly instead of wrapping it in a function.
`,
		},
		{
			code: `
const hasTruthyValue = array.some((element: unknown) => element);
`,
			snapshot: `
const hasTruthyValue = array.some((element: unknown) => element);
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                                  Use Boolean directly instead of wrapping it in a function.
`,
		},
		{
			code: `
array.filter((item: unknown) => Boolean(item));
`,
			snapshot: `
array.filter((item: unknown) => Boolean(item));
             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
             Use Boolean directly instead of wrapping it in a function.
`,
		},
	],
	valid: [
		"const toBoolean = Boolean;",
		"const toString = String;",
		"const toNumber = Number;",
		"const toBigInt = BigInt;",
		"const toSymbol = Symbol;",
		"const toStringObject = (value: unknown) => new String(value);",
		"const transform = (value: unknown) => value.toString();",
		"const transform = (value: unknown) => Boolean(value) && doSomething();",
		"const transform = (a: unknown, b: unknown) => Boolean(a);",
		"const transform = () => Boolean(someGlobal);",
		"const transform = (value: unknown) => customBoolean(value);",
		"const transform = (value: unknown) => { console.log(value); return Boolean(value); };",
	],
});
