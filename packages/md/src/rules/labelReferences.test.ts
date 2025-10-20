import rule from "./labelReferences.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
[ESLint][eslint]
`,
			snapshot: `
[ESLint][eslint]
 ~~~~~~
 This label reference 'eslint' has no definition.
`,
		},
		{
			code: `
[eslint][]
`,
			snapshot: `
[eslint][]
 ~~~~~~
 This label reference 'eslint' has no definition.
`,
		},
		{
			code: `
[eslint]
`,
			snapshot: `
[eslint]
 ~~~~~~
 This label reference 'eslint' has no definition.
`,
		},
		{
			code: `
![Logo][logo]
`,
			snapshot: `
![Logo][logo]
  ~~~~
  This label reference 'logo' has no definition.
`,
		},
		{
			code: `
[Valid link][valid]

[valid]: https://example.com

[Missing link][missing]
`,
			snapshot: `
[Valid link][valid]

[valid]: https://example.com

[Missing link][missing]
 ~~~~~~~
 This label reference 'missing' has no definition.
`,
		},
	],
	valid: [
		`
[ESLint][eslint]

[eslint]: https://eslint.org
`,
		`
[eslint][]

[eslint]: https://eslint.org
`,
		`
[eslint]

[eslint]: https://eslint.org
`,
		`
![Logo][logo]

[logo]: ./logo.png
`,
		`
[First][first]
[Second][second]

[first]: https://example.com/1
[second]: https://example.com/2
`,
		`
Check out [this link][ref] and ![this image][img].

[ref]: https://example.com
[img]: image.png
`,
	],
});
