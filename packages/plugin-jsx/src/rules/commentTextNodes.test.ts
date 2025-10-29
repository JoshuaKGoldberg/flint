import rule from "./commentTextNodes.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div>// This looks like a comment</div>`,
			fileName: "file.tsx",
			snapshot: `
<div>// This looks like a comment</div>
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     This text looks like a comment but will be rendered as text in the JSX output.`,
		},
		{
			code: `
<div>/* This also looks like a comment */</div>`,
			fileName: "file.tsx",
			snapshot: `
<div>/* This also looks like a comment */</div>
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     This text looks like a comment but will be rendered as text in the JSX output.`,
		},
		{
			code: `
<span>
    // comment text
</span>`,
			fileName: "file.tsx",
			snapshot: `
<span>
    // comment text
    ~~~~~~~~~~~~~~~
    This text looks like a comment but will be rendered as text in the JSX output.
</span>
`,
		},
		{
			code: `
<p>
    /* inline comment */
</p>`,
			fileName: "file.tsx",
			snapshot: `
<p>
    /* inline comment */
    ~~~~~~~~~~~~~~~~~~~~
    This text looks like a comment but will be rendered as text in the JSX output.
</p>
`,
		},
	],
	valid: [
		{ code: `<div>Regular text</div>`, fileName: "file.tsx" },
		{ code: `<div>{/* This is a real comment */}</div>`, fileName: "file.tsx" },
		{
			code: `<div>
    {/* Comment inside expression */}
    Text content
</div>`,
			fileName: "file.tsx",
		},
		{ code: `<span>No comment syntax here</span>`, fileName: "file.tsx" },
		{
			code: `<div>
    {// Single line comment in expression
    }
</div>`,
			fileName: "file.tsx",
		},
		{
			code: `<a href="https://example.com">Link</a>`,
			fileName: "file.tsx",
		},
		{
			code: `<div>Text before // comment syntax</div>`,
			fileName: "file.tsx",
		},
		{
			code: `<div>Text before /* comment */ syntax</div>`,
			fileName: "file.tsx",
		},
	],
});
