import rule from "./consecutiveNonNullAssertions.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
declare const outer: { inner: number } | null;
outer!!.inner;
`,
			output: `
declare const outer: { inner: number } | null;
outer!.inner;
`,
			snapshot: `
declare const outer: { inner: number } | null;
outer!!.inner;
     ~~
     Consecutive non-null assertion operators are unnecessary.
`,
		},
	],
	valid: [
		`
declare const outer: { inner: number } | null;
outer!.inner;
`,
		`
declare const outer: { inner: number } | null;
outer?.inner!;
`,
	],
});
