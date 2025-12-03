import { ruleTester } from "./ruleTester.js";
import rule from "./withStatements.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
with (ooo.eee.oo.ah_ah.ting.tang.walla.walla) {
	bing = true;
	bang = true;
}
`,
			snapshot: `
with (ooo.eee.oo.ah_ah.ting.tang.walla.walla) {
~~~~
The with statement is potentially problematic because it adds members of an object to the current scope, making it impossible to tell what a variable inside the block actually refers to.
	bing = true;
	bang = true;
}
`,
		},
	],
	valid: [
		`var o = ooo.eee.oo.ah_ah.ting.tang.walla.walla;
o.bing = true;
o.bang = true;`,
	],
});
