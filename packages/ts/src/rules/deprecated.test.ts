import rule from "./deprecated.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
/** @deprecated Use newFunction instead */
function oldFunction() {}
oldFunction();
`,
			snapshot: `
/** @deprecated Use newFunction instead */
function oldFunction() {}
oldFunction();
~~~~~~~~~~~
This is deprecated.
`,
		},
		{
			code: `
class Example {
    /** @deprecated Use newMethod instead */
    oldMethod() {}

    test() {
        this.oldMethod();
    }
}
`,
			snapshot: `
class Example {
    /** @deprecated Use newMethod instead */
    oldMethod() {}

    test() {
        this.oldMethod();
             ~~~~~~~~~
             This is deprecated.
    }
}
`,
		},
		{
			code: `
/** @deprecated Use NewClass instead */
class OldClass {}
const instance = new OldClass();
`,
			snapshot: `
/** @deprecated Use NewClass instead */
class OldClass {}
const instance = new OldClass();
                     ~~~~~~~~
                     This is deprecated.
`,
		},
		{
			code: `
const obj = {
    /** @deprecated Use newProperty instead */
    oldProperty: 1
};
console.log(obj.oldProperty);
`,
			snapshot: `
const obj = {
    /** @deprecated Use newProperty instead */
    oldProperty: 1
};
console.log(obj.oldProperty);
                ~~~~~~~~~~~
                This is deprecated.
`,
		},
	],
	valid: [
		"function active() {} active();",
		"class Active { method() { this.method(); } }",
		`/** @deprecated */
function unused() {}
function active() {}
active();`,
		`const obj = { property: 1 }; console.log(obj.property);`,
	],
});
