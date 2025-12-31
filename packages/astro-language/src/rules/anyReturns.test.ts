import rule from "../../../ts/lib/rules/anyReturns.js";
import { astroLanguage } from "../language.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(astroLanguage.createRule(rule), {
	invalid: [
		{
			code: `
---
function foo() {
	return 1 as any
}
---
			`,
			snapshot: `
---
function foo() {
	return 1 as any
	~~~~~~~~~~~~~~~
	Unsafe return of a value of type \`any\`.
}
---
			`,
		},
		{
			code: `
---
---
{
function foo() {
	return 1 as any
}
}
			`,
			snapshot: `
---
---
{
function foo() {
	return 1 as any
	~~~~~~~~~~~~~~~
	Unsafe return of a value of type \`any\`.
}
}
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
