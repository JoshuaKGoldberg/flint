import { ruleTester } from "../../ruleTester.js";
import rule from "./emptyMappingKeys.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
: a
`,
			snapshot: `
: a
~
This mapping has an empty key, which is often a mistake.
`,
		},
		{
			code: `
a:
    : b
`,
			snapshot: `
a:
    : b
   ~
   This mapping has an empty key, which is often a mistake.
`,
		},
		{
			code: `
a:
  : b
`,
			snapshot: `
a:
  : b
 ~
 This mapping has an empty key, which is often a mistake.
`,
		},
	],
	valid: [
		// https://github.com/prettier/yaml-unist-parser/issues/296
		// ``,

		`a: b`,
	],
});
