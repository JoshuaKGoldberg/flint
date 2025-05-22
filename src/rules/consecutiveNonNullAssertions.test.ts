import { describe, it } from "vitest";

import { RuleTester } from "../testing/RuleTester.js";
import rule from "./consecutiveNonNullAssertions.js";

const ruleTester = new RuleTester({
	describe,
	it,
});

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
     Unnecessary consecutive non-null assertion operator.
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
