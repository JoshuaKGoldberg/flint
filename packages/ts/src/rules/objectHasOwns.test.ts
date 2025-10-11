import rule from "./objectHasOwns.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const hasKey = obj.hasOwnProperty("key");
`,
			snapshot: `
const hasKey = obj.hasOwnProperty("key");
               ~~~~~~~~~~~~~~~~~~~~~~~~~
               Prefer Object.hasOwn() over hasOwnProperty() calls.
`,
		},
		{
			code: `
if (obj.hasOwnProperty("prop")) {
    console.log("Has property");
}
`,
			snapshot: `
if (obj.hasOwnProperty("prop")) {
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    Prefer Object.hasOwn() over hasOwnProperty() calls.
    console.log("Has property");
}
`,
		},
		{
			code: `
const result = Object.prototype.hasOwnProperty.call(obj, "key");
`,
			snapshot: `
const result = Object.prototype.hasOwnProperty.call(obj, "key");
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
               Prefer Object.hasOwn() over hasOwnProperty() calls.
`,
		},
		{
			code: `
if (Object.prototype.hasOwnProperty.call(obj, "prop")) {
    console.log("Has property");
}
`,
			snapshot: `
if (Object.prototype.hasOwnProperty.call(obj, "prop")) {
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Prefer Object.hasOwn() over hasOwnProperty() calls.
    console.log("Has property");
}
`,
		},
		{
			code: `
const hasKey = {}.hasOwnProperty.call(obj, "key");
`,
			snapshot: `
const hasKey = {}.hasOwnProperty.call(obj, "key");
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
               Prefer Object.hasOwn() over hasOwnProperty() calls.
`,
		},
		{
			code: `
if ({}.hasOwnProperty.call(obj, "prop")) {
    console.log("Has property");
}
`,
			snapshot: `
if ({}.hasOwnProperty.call(obj, "prop")) {
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Prefer Object.hasOwn() over hasOwnProperty() calls.
    console.log("Has property");
}
`,
		},
		{
			code: `
const value = someObj.hasOwnProperty(key);
`,
			snapshot: `
const value = someObj.hasOwnProperty(key);
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~
              Prefer Object.hasOwn() over hasOwnProperty() calls.
`,
		},
		{
			code: `
function check(obj: object, key: string) {
    return obj.hasOwnProperty(key);
}
`,
			snapshot: `
function check(obj: object, key: string) {
    return obj.hasOwnProperty(key);
           ~~~~~~~~~~~~~~~~~~~~~~~
           Prefer Object.hasOwn() over hasOwnProperty() calls.
}
`,
		},
	],
	valid: [
		`const hasKey = Object.hasOwn(obj, "key");`,
		`if (Object.hasOwn(obj, "prop")) { console.log("Has property"); }`,
		`const result = Object.hasOwn(obj, key);`,
		`function check(obj: object, key: string) { return Object.hasOwn(obj, key); }`,
		`const descriptor = Object.getOwnPropertyDescriptor(obj, "key");`,
		`const keys = Object.getOwnPropertyNames(obj);`,
		`const symbols = Object.getOwnPropertySymbols(obj);`,
	],
});
