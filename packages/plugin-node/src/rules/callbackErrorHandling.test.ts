import rule from "./callbackErrorHandling.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
function callback(err) {
    console.log("done");
}
`,
			snapshot: `
function callback(err) {
                  ~~~
                  Expected error to be handled in callback function.
    console.log("done");
}
`,
		},
		{
			code: `
const callback = function(err) {
    return true;
};
`,
			snapshot: `
const callback = function(err) {
                          ~~~
                          Expected error to be handled in callback function.
    return true;
};
`,
		},
		{
			code: `
const callback = (err) => {
    doSomething();
};
`,
			snapshot: `
const callback = (err) => {
                  ~~~
                  Expected error to be handled in callback function.
    doSomething();
};
`,
		},
		{
			code: `
const callback = (err) => doSomething();
`,
			snapshot: `
const callback = (err) => doSomething();
                  ~~~
                  Expected error to be handled in callback function.
`,
		},
		{
			code: `
function callback(error) {
    console.log("done");
}
`,
			options: { errorArgument: "error" },
			snapshot: `
function callback(error) {
                  ~~~~~
                  Expected error to be handled in callback function.
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
                  Expected error to be handled in callback function.
    console.log("done");
}
`,
		},
	],
	valid: [
		`function callback(err) { if (err) throw err; }`,
		`function callback(err) { console.log(err); }`,
		`const callback = function(err) { return err; };`,
		`const callback = (err) => { if (err) throw err; };`,
		`const callback = (err) => err;`,
		`function callback(err, data) { return err || data; }`,
		`function callback(data) { console.log(data); }`,
		`function callback(err) { const error = err; throw error; }`,
		`function callback(_err) { console.log("done"); }`,
		`const callback = (error) => { console.log("done"); }`,
	],
});
