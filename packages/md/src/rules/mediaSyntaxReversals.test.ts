import rule from "./mediaSyntaxReversals.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
(ESLint)[https://eslint.org/]
`,
			snapshot: `
(ESLint)[https://eslint.org/]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
This link syntax is reversed.
`,
		},
		{
			code: `
!(A beautiful sunset)[sunset.png]
`,
			snapshot: `
!(A beautiful sunset)[sunset.png]
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
This image syntax is reversed.
`,
		},
		{
			code: `
# (ESLint)[https://eslint.org/]
`,
			snapshot: `
# (ESLint)[https://eslint.org/]
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  This link syntax is reversed.
`,
		},
		{
			code: `
# !(A beautiful sunset)[sunset.png]
`,
			snapshot: `
# !(A beautiful sunset)[sunset.png]
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  This image syntax is reversed.
`,
		},
		{
			code: `
Check out (this link)[https://example.com] for more info.
`,
			snapshot: `
Check out (this link)[https://example.com] for more info.
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          This link syntax is reversed.
`,
		},
		{
			code: `
Both (link)[url] and !(image)[path] are wrong.
`,
			snapshot: `
Both (link)[url] and !(image)[path] are wrong.
                     ~~~~~~~~~~~~~~
                     This image syntax is reversed.
     ~~~~~~~~~~~
     This link syntax is reversed.
`,
		},
	],
	valid: [
		`
[ESLint](https://eslint.org/)
`,
		`
![A beautiful sunset](sunset.png)
`,
		`
# [ESLint](https://eslint.org/)
`,
		`
# ![A beautiful sunset](sunset.png)
`,
		`
Check out [this link](https://example.com) for more info.
`,
		`
Both [link](url) and ![image](path) are correct.
`,
		`
Normal (parentheses) and [square brackets] are fine.
`,
	],
});
