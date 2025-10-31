import rule from "./emptyDocuments.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
---
`,
			output: ``,
			snapshot: `
---
~~~
This document is empty and contains no content, which is often a mistake.
`,
		},
		{
			code: `
---
...
`,
			output: ``,
			snapshot: `
---
~~~
This document is empty and contains no content, which is often a mistake.
...
`,
		},
		{
			code: `
---

---
key: value
`,
			output: `
---
key: value
`,
			snapshot: `
---
~~~
This document is empty and contains no content, which is often a mistake.

---
key: value
`,
		},
	],
	valid: [
		`key: value`,
		`---
key: value`,
		`# just a comment
key: value`,
	],
});
