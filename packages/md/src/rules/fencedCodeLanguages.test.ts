import rule from "./fencedCodeLanguages.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
\`\`\`
const message = "Hello, world!";
console.log(message);
\`\`\`
`,
			snapshot: `
\`\`\`
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
This fenced code block is missing a language.
const message = "Hello, world!";
console.log(message);
\`\`\`
`,
		},
		{
			code: `
Some text.

\`\`\`
plain text here
\`\`\`
`,
			snapshot: `
Some text.

\`\`\`
~~~~~~~~~~~~~~~~~~~~~~~
This fenced code block is missing a language.
plain text here
\`\`\`
`,
		},
		{
			code: `
# Heading

\`\`\`
code without language
\`\`\`

More content.
`,
			snapshot: `
# Heading

\`\`\`
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
This fenced code block is missing a language.
code without language
\`\`\`

More content.
`,
		},
		{
			code: `
\`\`\`
first block
\`\`\`

\`\`\`
second block
\`\`\`
`,
			snapshot: `
\`\`\`
~~~~~~~~~~~~~~~~~~~
This fenced code block is missing a language.
first block
\`\`\`

\`\`\`
~~~~~~~~~~~~~~~~~~~~
This fenced code block is missing a language.
second block
\`\`\`
`,
		},
	],
	valid: [
		`
\`\`\`js
const message = "Hello, world!";
console.log(message);
\`\`\`
`,
		`
\`\`\`javascript
const message = "Hello, world!";
console.log(message);
\`\`\`
`,
		`
\`\`\`text
plain text here
\`\`\`
`,
		`
\`\`\`python
def greet():
    print("Hello, world!")
\`\`\`
`,
		`
# Heading

\`\`\`typescript
const value: string = "test";
\`\`\`

More content.
`,
		`
Multiple blocks:

\`\`\`html
<div>Hello</div>
\`\`\`

\`\`\`css
.class { color: red; }
\`\`\`
`,
	],
});
