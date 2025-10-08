import rule from "./asyncPromiseExecutors.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const promise = new Promise(async (resolve, reject) => {
	resolve(await fetch('/api'));
});
`,
			snapshot: `
const promise = new Promise(async (resolve, reject) => {
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                            Promise executor functions should not be async.
	resolve(await fetch('/api'));
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Promise executor functions should not be async.
});
~~~
Promise executor functions should not be async.
`,
		},
		{
			code: `
new Promise(async function(resolve, reject) {
	resolve(42);
});
`,
			snapshot: `
new Promise(async function(resolve, reject) {
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            Promise executor functions should not be async.
	resolve(42);
~~~~~~~~~~~~~
Promise executor functions should not be async.
});
~~~
Promise executor functions should not be async.
`,
		},
		{
			code: `
const p = new Promise(async (resolve) => {
	await doSomething();
	resolve();
});
`,
			snapshot: `
const p = new Promise(async (resolve) => {
                      ~~~~~~~~~~~~~~~~~~~~~~
                      Promise executor functions should not be async.
	await doSomething();
~~~~~~~~~~~~~~~~~~~~~
Promise executor functions should not be async.
	resolve();
~~~~~~~~~~~
Promise executor functions should not be async.
});
~~~
Promise executor functions should not be async.
`,
		},
	],
	valid: [
		`
new Promise((resolve, reject) => {
	resolve(42);
});
`,
		`
new Promise(function(resolve, reject) {
	resolve(42);
});
`,
		`
const p = new Promise((resolve) => {
	doSomething().then(resolve);
});
`,
		`
// Not a Promise constructor
new SomethingElse(async (resolve) => {
	resolve();
});
`,
	],
});
