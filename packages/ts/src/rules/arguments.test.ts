import rule from "./arguments.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
function test() {
	return arguments;
}
`,
			snapshot: `
function test() {
	return arguments;
	       ~~~~~~~~~
	       Use rest parameters instead of \`arguments\`.
}
`,
		},
		{
			code: `
function test() {
	console.log(arguments[0]);
}
`,
			snapshot: `
function test() {
	console.log(arguments[0]);
	            ~~~~~~~~~
	            Use rest parameters instead of \`arguments\`.
}
`,
		},
		{
			code: `
function test() {
	for (let i = 0; i < arguments.length; i++) {
		console.log(arguments[i]);
	}
}
`,
			snapshot: `
function test() {
	for (let i = 0; i < arguments.length; i++) {
	                    ~~~~~~~~~
	                    Use rest parameters instead of \`arguments\`.
		console.log(arguments[i]);
		            ~~~~~~~~~
		            Use rest parameters instead of \`arguments\`.
	}
}
`,
		},
		{
			code: `
const obj = {
	method() {
		return arguments;
	}
};
`,
			snapshot: `
const obj = {
	method() {
		return arguments;
		       ~~~~~~~~~
		       Use rest parameters instead of \`arguments\`.
	}
};
`,
		},
		{
			code: `
function outer() {
	function inner() {
		return arguments;
	}
}
`,
			snapshot: `
function outer() {
	function inner() {
		return arguments;
		       ~~~~~~~~~
		       Use rest parameters instead of \`arguments\`.
	}
}
`,
		},
	],
	valid: [
		`function test(...args) { return args; }`,
		`function test(arguments) { return arguments; }`,
		`const arguments = [1, 2, 3]; console.log(arguments);`,
		`const arrow = (...args) => args;`,
		`() => { const args = []; }`,
		`class Test { method(...args) { return args; } }`,
	],
});
