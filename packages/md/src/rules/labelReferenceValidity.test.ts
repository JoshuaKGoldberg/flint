import rule from "./labelReferenceValidity.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
[eslint][ ]
`,
			snapshot: `
[eslint][ ]
~~~~~~~~~~~
This label reference has invalid whitespace between brackets.
`,
		},
		{
			code: `
[eslint][
]
`,
			snapshot: `
[eslint][
~~~~~~~~~~~
This label reference has invalid whitespace between brackets.
]
`,
		},
		{
			code: `
[link][  ]
`,
			snapshot: `
[link][  ]
~~~~~~~~~~
This label reference has invalid whitespace between brackets.
`,
		},
		{
			code: `
Check out [ESLint][ ] for more info.
`,
			snapshot: `
Check out [ESLint][ ] for more info.
          ~~~~~~~~~~~
          This label reference has invalid whitespace between brackets.
`,
		},
	],
	valid: [
		`[eslint][]`,
		`[eslint][eslint]`,
		`
[eslint][]

[eslint]: https://eslint.org
`,
		`
[link][ref]

[ref]: https://example.com
`,
		`
Check out [ESLint][] for more info.

[eslint]: https://eslint.org
`,
		`[valid]`,
	],
});
