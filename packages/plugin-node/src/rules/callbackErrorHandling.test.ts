import rule from "./callbackErrorHandling.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
function callback(error) {
    console.log("done");
}
`,
			snapshot: `
function callback(error) {
                  ~~~~~
                  This error is not handled in the callback, which may indicate missing error handling logic.
    console.log("done");
}
`,
		},
		{
			code: `
function callback(err) {
    console.log("done");
}
`,
			snapshot: `
function callback(err) {
                  ~~~
                  This error is not handled in the callback, which may indicate missing error handling logic.
    console.log("done");
}
`,
		},
		{
			code: `
const callback = function(error) {
    return true;
};
`,
			snapshot: `
const callback = function(error) {
                          ~~~~~
                          This error is not handled in the callback, which may indicate missing error handling logic.
    return true;
};
`,
		},
		{
			code: `
const callback = (error) => {
    doSomething();
};
`,
			snapshot: `
const callback = (error) => {
                  ~~~~~
                  This error is not handled in the callback, which may indicate missing error handling logic.
    doSomething();
};
`,
		},
		{
			code: `
const callback = (error) => doSomething();
`,
			snapshot: `
const callback = (error) => doSomething();
                  ~~~~~
                  This error is not handled in the callback, which may indicate missing error handling logic.
`,
		},
		{
			code: `
function callback(err) {
    console.log("done");
}
`,
			options: { errorArgument: "err" },
			snapshot: `
function callback(err) {
                  ~~~
                  This error is not handled in the callback, which may indicate missing error handling logic.
    console.log("done");
}
`,
		},
		{
			code: `
function callback(err123) {
    console.log("done");
}
`,
			options: { errorArgument: "^err" },
			snapshot: `
function callback(err123) {
                  ~~~~~~
                  This error is not handled in the callback, which may indicate missing error handling logic.
    console.log("done");
}
`,
		},
	],
	valid: [
		`function callback(error) { if (error) throw error; }`,
		`function callback(error) { console.log(error); }`,
		`const callback = function(error) { return error; };`,
		`const callback = (error) => { if (error) throw error; };`,
		`const callback = (error) => error;`,
		`function callback(error, data) { return error || data; }`,
		`function callback(data) { console.log(data); }`,
		`function callback(error) { const error = error; throw error; }`,
		`function callback(_err) { console.log("done"); }`,
		`const callback = (other) => { console.log("done"); }`,
	],
});
