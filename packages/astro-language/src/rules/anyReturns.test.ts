import rule from "../../../ts/lib/rules/anyReturns.js";
import { astroLanguage } from "../language.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(astroLanguage.createRule(rule), {
	invalid: [
		{
			code: `
---
type bar = 1
function foo() {
	return 1 as any
}
---
			`,
			snapshot: `
---
type bar = 1
function foo() {
	return 1 as any
	~~~~~~~~~~~~~~~
	Unsafe return of a value of type \`any\`.
}
---
			`,
		},
	],
	valid: [
		{
			code: `
---
function foo() {
	return 1
}
---
		`,
		},
	],
});
