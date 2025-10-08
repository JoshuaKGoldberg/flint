import rule from "./asyncPromiseExecutors.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
new Promise(async (resolve, reject) => {
	resolve(42);
});
`,
			snapshot: `
new Promise(async (resolve, reject) => {
            ~~~~~
            Promise executor functions should not be async because errors thrown within them won't be caught properly.
	resolve(42);
});
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
            ~~~~~
            Promise executor functions should not be async because errors thrown within them won't be caught properly.
	resolve(42);
});
`,
		},
		{
			code: `
const p = new Promise(async (resolve) => {
	resolve();
});
`,
			snapshot: `
const p = new Promise(async (resolve) => {
                      ~~~~~
                      Promise executor functions should not be async because errors thrown within them won't be caught properly.
	resolve();
});
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
