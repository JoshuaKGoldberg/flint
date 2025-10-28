import rule from "./implicitGlobals.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
var globalVariable = 42;
`,
			snapshot: `
var globalVariable = 42;
    ~~~~~~~~~~~~~~
    Avoid creating implicit global variable \`globalVariable\` that pollutes the global scope.
`,
		},
		{
			code: `
var x = 1, y = 2;
`,
			snapshot: `
var x = 1, y = 2;
    ~
    Avoid creating implicit global variable \`x\` that pollutes the global scope.
           ~
           Avoid creating implicit global variable \`y\` that pollutes the global scope.
`,
		},
		{
			code: `
function globalFunction() {}
`,
			snapshot: `
function globalFunction() {}
         ~~~~~~~~~~~~~~
         Avoid creating implicit global function \`globalFunction\` that pollutes the global scope.
`,
		},
		{
			code: `
var { a, b } = object;
`,
			snapshot: `
var { a, b } = object;
    ~~~~~~~~
    Avoid creating implicit global variable \`{ a, b }\` that pollutes the global scope.
`,
		},
		{
			code: `
var [first, second] = array;
`,
			snapshot: `
var [first, second] = array;
    ~~~~~~~~~~~~~~~
    Avoid creating implicit global variable \`[first, second]\` that pollutes the global scope.
`,
		},
	],
	valid: [
		`const localConstant = 42;`,
		`let localVariable = 42;`,
		`
			const localConstant = 42;
			export {};
		`,
		`
			var globalVariable = 42;
			export {};
		`,
		`
			function globalFunction() {}
			export {};
		`,
		`
			declare var ambientVariable: number;
		`,
		`
			declare function ambientFunction(): void;
		`,
		`
			{
				var blockVariable = 1;
			}
		`,
		`
			(function () {
				var innerVariable = 1;
			})();
		`,
		`
			function outer() {
				var innerVariable = 1;
			}
			export {};
		`,
	],
});
