import rule from "./blockSequences.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
items: [a, b, c]
`,
			snapshot: `
items: [a, b, c]
       ~~~~~~~~~
       Prefer block style sequences over flow style sequences.
`,
		},
		{
			code: `
value: [1, 2, 3]
`,
			snapshot: `
value: [1, 2, 3]
       ~~~~~~~~~
       Prefer block style sequences over flow style sequences.
`,
		},
		{
			code: `
nested:
  items: [x, y]
`,
			snapshot: `
nested:
  items: [x, y]
         ~~~~~~
         Prefer block style sequences over flow style sequences.
`,
		},
		{
			code: `
empty: []
`,
			snapshot: `
empty: []
       ~~
       Prefer block style sequences over flow style sequences.
`,
		},
	],
	valid: [
		`items:
  - a
  - b
  - c`,
		`value:
  - 1
  - 2
  - 3`,
		`nested:
  items:
    - x
    - y`,
		`single:
  - item`,
	],
});
