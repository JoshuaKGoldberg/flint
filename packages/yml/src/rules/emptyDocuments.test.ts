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
		{
			code: `---
key: value
---
`,
			output: `---
key: value
`,
			snapshot: `---
key: value
---
~~~
This document is empty and contains no content, which is often a mistake.
`,
		},
		{
			code: `---
key1: value1
---
---
key2: value2
`,
			output: `---
key1: value1
---
key2: value2
`,
			snapshot: `---
key1: value1
---
~~~
This document is empty and contains no content, which is often a mistake.
---
key2: value2
`,
		},
		{
			code: `---
...
---
key: value
`,
			output: `---
key: value
`,
			snapshot: `---
~~~
This document is empty and contains no content, which is often a mistake.
...
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
		`---
key: value
---
another: value`,
		`---
key: value
...`,
	],
});
