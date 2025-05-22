import { describe, it } from "vitest";

import { RuleTester } from "../testing/RuleTester.js";
import rule from "./namespaceDeclarations.js";

const ruleTester = new RuleTester({
	describe,
	it,
});

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
namespace name {}
`,
			snapshot: `
namespace name {}
~~~~~~~~~
Prefer using ECMAScript modules over legacy TypeScript namespaces.
`,
		},
	],
	valid: [
		`declare global {}`,
		`declare module 'name' {}`,
		{
			code: `declare module name {}`,
			options: { allowDeclarations: true },
		},
		{
			code: `declare namespace name {}`,
			options: { allowDeclarations: true },
		},
		{
			code: `
declare namespace outer {
    namespace inner {}
}`,
			options: { allowDeclarations: true },
		},
		{
			code: `namespace name {}`,
			fileName: "file.d.ts",
			options: { allowDefinitionFiles: true },
		},
	],
});
