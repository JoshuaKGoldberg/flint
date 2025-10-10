import { ruleTester } from "./ruleTester.js";
import rule from "./shadowedRestrictedNames.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
let undefined = 5;
`,
			snapshot: `
let undefined = 5;
    ~~~~~~~~~
    Avoid shadowing restricted names like undefined, NaN, Infinity, arguments, and eval.
`,
		},
		{
			code: `
const NaN = 123;
`,
			snapshot: `
const NaN = 123;
      ~~~
      Avoid shadowing restricted names like undefined, NaN, Infinity, arguments, and eval.
`,
		},
		{
			code: `
var Infinity = 100;
`,
			snapshot: `
var Infinity = 100;
    ~~~~~~~~
    Avoid shadowing restricted names like undefined, NaN, Infinity, arguments, and eval.
`,
		},
		{
			code: `
function test(arguments) {
	return arguments.length;
}
`,
			snapshot: `
function test(arguments) {
              ~~~~~~~~~
              Avoid shadowing restricted names like undefined, NaN, Infinity, arguments, and eval.
	return arguments.length;
}
`,
		},
		{
			code: `
function eval() {
	return 42;
}
`,
			snapshot: `
function eval() {
         ~~~~
         Avoid shadowing restricted names like undefined, NaN, Infinity, arguments, and eval.
	return 42;
}
`,
		},
		{
			code: `
const arrowFunc = (undefined) => undefined;
`,
			snapshot: `
const arrowFunc = (undefined) => undefined;
                   ~~~~~~~~~
                   Avoid shadowing restricted names like undefined, NaN, Infinity, arguments, and eval.
`,
		},
		{
			code: `
class NaN {
	constructor() {}
}
`,
			snapshot: `
class NaN {
      ~~~
      Avoid shadowing restricted names like undefined, NaN, Infinity, arguments, and eval.
	constructor() {}
}
`,
		},
		{
			code: `
const obj = {
	method(eval) {
		return eval;
	}
};
`,
			snapshot: `
const obj = {
	method(eval) {
        ~~~~
        Avoid shadowing restricted names like undefined, NaN, Infinity, arguments, and eval.
		return eval;
	}
};
`,
		},
		{
			code: `
function test() {
	const { undefined } = obj;
}
`,
			snapshot: `
function test() {
	const { undefined } = obj;
         ~~~~~~~~~
         Avoid shadowing restricted names like undefined, NaN, Infinity, arguments, and eval.
}
`,
		},
		{
			code: `
function test() {
	const [NaN] = array;
}
`,
			snapshot: `
function test() {
	const [NaN] = array;
        ~~~
        Avoid shadowing restricted names like undefined, NaN, Infinity, arguments, and eval.
}
`,
		},
	],
	valid: [
		`let value = undefined;`,
		`const result = NaN;`,
		`const max = Infinity;`,
		`function test() { return arguments; }`,
		`const code = eval("1 + 1");`,
		`let myValue = 5;`,
		`function myFunction() {}`,
		`class MyClass {}`,
		`const obj = { undefined: 5 };`,
		`const key = "undefined";`,
		`obj.undefined = 5;`,
	],
});
