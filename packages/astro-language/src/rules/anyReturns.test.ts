import rule from "../../../ts/lib/rules/anyReturns.js";
import { astroLanguage } from "../index.js";
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
type bar = 1
function foo() {
	return 1
}
---
		`,
		},
	],
});
