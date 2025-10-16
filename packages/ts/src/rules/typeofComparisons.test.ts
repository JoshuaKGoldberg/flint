import { ruleTester } from "./ruleTester.js";
import rule from "./typeofComparisons.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
if (typeof value === "strnig") {
    process();
}
`,
			snapshot: `
if (typeof value === "strnig") {
                     ~~~~~~~~
                     Invalid typeof comparison value. Expected one of: "bigint", "boolean", "function", "number", "object", "string", "symbol", "undefined".
    process();
}
`,
		},
		{
			code: `
if (typeof variable == "undefimed") {
    handle();
}
`,
			snapshot: `
if (typeof variable == "undefimed") {
                       ~~~~~~~~~~~
                       Invalid typeof comparison value. Expected one of: "bigint", "boolean", "function", "number", "object", "string", "symbol", "undefined".
    handle();
}
`,
		},
		{
			code: `
if (typeof data != "nunber") {
    reject();
}
`,
			snapshot: `
if (typeof data != "nunber") {
                   ~~~~~~~~
                   Invalid typeof comparison value. Expected one of: "bigint", "boolean", "function", "number", "object", "string", "symbol", "undefined".
    reject();
}
`,
		},
		{
			code: `
if (typeof callback !== "fucntion") {
    throw new Error("Invalid callback");
}
`,
			snapshot: `
if (typeof callback !== "fucntion") {
                        ~~~~~~~~~~
                        Invalid typeof comparison value. Expected one of: "bigint", "boolean", "function", "number", "object", "string", "symbol", "undefined".
    throw new Error("Invalid callback");
}
`,
		},
		{
			code: `
if ("bolean" === typeof flag) {
    toggle();
}
`,
			snapshot: `
if ("bolean" === typeof flag) {
    ~~~~~~~~
    Invalid typeof comparison value. Expected one of: "bigint", "boolean", "function", "number", "object", "string", "symbol", "undefined".
    toggle();
}
`,
		},
		{
			code: `
if (typeof value === "String") {
    process();
}
`,
			snapshot: `
if (typeof value === "String") {
                     ~~~~~~~~
                     Invalid typeof comparison value. Expected one of: "bigint", "boolean", "function", "number", "object", "string", "symbol", "undefined".
    process();
}
`,
		},
		{
			code: `
const isValid = typeof input !== "array";
`,
			snapshot: `
const isValid = typeof input !== "array";
                                 ~~~~~~~
                                 Invalid typeof comparison value. Expected one of: "bigint", "boolean", "function", "number", "object", "string", "symbol", "undefined".
`,
		},
	],
	valid: [
		`if (typeof value === "string") { process(); }`,
		`if (typeof variable == "undefined") { handle(); }`,
		`if (typeof data != "number") { reject(); }`,
		`if (typeof callback !== "function") { throw new Error("Invalid callback"); }`,
		`if (typeof flag === "boolean") { toggle(); }`,
		`if (typeof value === "object") { parse(); }`,
		`if (typeof value === "symbol") { handle(); }`,
		`if (typeof value === "bigint") { compute(); }`,
		`if (typeof value === other) { process(); }`,
		`if (typeof value === typeof other) { compare(); }`,
		`const type = typeof value;`,
	],
});
