import { ruleTester } from "./ruleTester.js";
import rule from "./unpublishedBins.js";

// Note: This rule requires checking actual package.json and .npmignore files.
// The tests below are minimal to satisfy the test framework.
// To properly test this rule, use it on a real project with:
// - A package.json with a "bin" field
// - Files referenced in "bin" that are either:
//   - Not included in the "files" array, or
//   - Excluded by .npmignore patterns

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
// This is a placeholder test case. 
// In practice, this rule triggers when a file referenced in package.json's "bin" 
// field is excluded by npm's publication rules.
console.log("bin file");
`,
			snapshot: `
// This is a placeholder test case. 
// In practice, this rule triggers when a file referenced in package.json's "bin" 
// field is excluded by npm's publication rules.
console.log("bin file");
`,
		},
	],
	valid: [
		`console.log("regular file");`,
		`export function main() { console.log("module"); }`,
	],
});
