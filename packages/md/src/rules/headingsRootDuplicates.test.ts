import rule from "./headingsRootDuplicates.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
# Heading 1

# Another H1 heading
`,
			snapshot: `
# Heading 1
~~~~~~~~~~~
This document has multiple H1 headings.

# Another H1 heading
~~~~~~~~~~~~~~~~~~~~
This document has multiple H1 headings.
`,
		},
		{
			code: `
# Heading 1

Another H1 heading
==================
`,
			snapshot: `
# Heading 1
~~~~~~~~~~~
This document has multiple H1 headings.

Another H1 heading
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
This document has multiple H1 headings.
==================
`,
		},
		{
			code: `
<h1>First Heading</h1>

<h1>Second Heading</h1>
`,
			snapshot: `
<h1>First Heading</h1>
~~~~~~~~~~~~~~~~~~~~~~
This document has multiple H1 headings.

<h1>Second Heading</h1>
~~~~~~~~~~~~~~~~~~~~~~~
This document has multiple H1 headings.
`,
		},
		{
			code: `
# First H1

## H2 Section

# Second H1
`,
			snapshot: `
# First H1
~~~~~~~~~~
This document has multiple H1 headings.

## H2 Section

# Second H1
~~~~~~~~~~~
This document has multiple H1 headings.
`,
		},
		{
			code: `
# Markdown H1

<h1>HTML H1</h1>
`,
			snapshot: `
# Markdown H1
~~~~~~~~~~~~~
This document has multiple H1 headings.

<h1>HTML H1</h1>
~~~~~~~~~~~~~~~~
This document has multiple H1 headings.
`,
		},
	],
	valid: [
		`
# Single Heading

Content here.
`,
		`
# Main Heading

## Subsection

### Deeper Section
`,
		`
<h1>Single HTML Heading</h1>

Content here.
`,
		`
## H2 Heading

Content without any H1.
`,
		`
# Single Heading

## Multiple H2s

## Are fine

### And H3s too
`,
	],
});
