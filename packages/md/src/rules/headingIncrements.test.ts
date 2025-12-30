import rule from "./headingIncrements.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
# Heading 1

### Heading 3
`,
			snapshot: `
# Heading 1

### Heading 3
~~~
This heading level 3 skips more than one level from the previous heading level of 1.
`,
		},
	],
	valid: [
		`# Heading 1`,
		`
# Heading 1

## Heading 2
`,
	],
});
