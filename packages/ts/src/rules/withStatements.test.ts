import { ruleTester } from "./ruleTester.js";
import rule from "./withStatements.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
with (value.foo) {
	bar = true;
	baz = true;
}
`,
			snapshot: `
with (value.foo) {
~~~~
The with statement is potentially problematic because it adds members of an object to the current scope, making it impossible to tell what a variable inside the block actually refers to.
	bar = true;
	baz = true;
}
`,
		},
	],
	valid: [
		`var o = value.foo;
o.bar = true;
o.baz = true;`,
	],
});
