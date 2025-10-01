import rule from "./debuggerStatements.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
debugger;
`,
			snapshot: `
debugger;
~~~~~~~~~
Debugger statements should not be used in production code.
`,
		},
		{
			code: `
function test() {
	debugger;
}
`,
			snapshot: `
function test() {
	debugger;
 ~~~~~~~~~
 Debugger statements should not be used in production code.
}
`,
		},
		{
			code: `
if (condition) {
	debugger;
}
`,
			snapshot: `
if (condition) {
	debugger;
 ~~~~~~~~~
 Debugger statements should not be used in production code.
}
`,
		},
	],
	valid: [
		`console.log("debugging");`,
		`function test() { console.log("test"); }`,
		`for (let i = 0; i < 10; i++) { break; }`,
		`for (let i = 0; i < 10; i++) { continue; }`,
		`function test() { return; }`,
		`throw new Error("test");`,
	],
});
