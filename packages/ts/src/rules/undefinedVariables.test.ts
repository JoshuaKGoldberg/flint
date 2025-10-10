import { ruleTester } from "./ruleTester.js";
import rule from "./undefinedVariables.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
console.log(undefinedVar);
`,
			snapshot: `
console.log(undefinedVar);
            ~~~~~~~~~~~~
            Using undefined variable 'undefinedVar'.
`,
		},
		{
			code: `
function test() {
    return notDefined;
}
`,
			snapshot: `
function test() {
    return notDefined;
           ~~~~~~~~~~
           Using undefined variable 'notDefined'.
}
`,
		},
		{
			code: `
const value = unknownVariable;
`,
			snapshot: `
const value = unknownVariable;
              ~~~~~~~~~~~~~~~
              Using undefined variable 'unknownVariable'.
`,
		},
		{
			code: `
if (condition) {
    doSomething();
}
`,
			snapshot: `
if (condition) {
    ~~~~~~~~~
    Using undefined variable 'condition'.
    doSomething();
    ~~~~~~~~~~~
    Using undefined variable 'doSomething'.
}
`,
		},
		{
			code: `
const result = first + second;
`,
			snapshot: `
const result = first + second;
               ~~~~~
               Using undefined variable 'first'.
                       ~~~~~~
                       Using undefined variable 'second'.
`,
		},
	],
	valid: [
		`const value = 5; console.log(value);`,
		`function test(parameter: number) { return parameter; }`,
		`let count = 0; count++;`,
		`const obj = { prop: 1 }; console.log(obj.prop);`,
		`typeof undefinedVar === "undefined"`,
		`const obj = {}; const { prop } = obj;`,
		`function fn() { return 1; } fn();`,
		`class MyClass {} const instance = new MyClass();`,
		`import { value } from "module"; console.log(value);`,
		`const array = [1, 2, 3]; array.forEach(item => console.log(item));`,
	],
});
