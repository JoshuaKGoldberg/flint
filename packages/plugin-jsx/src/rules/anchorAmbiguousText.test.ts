import rule from "./anchorAmbiguousText.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<a href="/page">click here</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a href="/page">click here</a>
                ~~~~~~~~~~
                This anchor element has ambiguous text that doesn't describe the link destination.
`,
		},
		{
			code: `
<a href="/page">here</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a href="/page">here</a>
                ~~~~
                This anchor element has ambiguous text that doesn't describe the link destination.
`,
		},
		{
			code: `
<a href="/page">link</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a href="/page">link</a>
                ~~~~
                This anchor element has ambiguous text that doesn't describe the link destination.
`,
		},
		{
			code: `
<a href="/page">a link</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a href="/page">a link</a>
                ~~~~~~
                This anchor element has ambiguous text that doesn't describe the link destination.
`,
		},
		{
			code: `
<a href="/page">learn more</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a href="/page">learn more</a>
                ~~~~~~~~~~
                This anchor element has ambiguous text that doesn't describe the link destination.
`,
		},
		{
			code: `
<a href="/page">more</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a href="/page">more</a>
                ~~~~
                This anchor element has ambiguous text that doesn't describe the link destination.
`,
		},
		{
			code: `
<a href="/page">read more</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a href="/page">read more</a>
                ~~~~~~~~~
                This anchor element has ambiguous text that doesn't describe the link destination.
`,
		},
		{
			code: `
<a href="/page">Click Here</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a href="/page">Click Here</a>
                ~~~~~~~~~~
                This anchor element has ambiguous text that doesn't describe the link destination.
`,
		},
	],
	valid: [
		{ code: `<a href="/about">About Us</a>`, fileName: "file.tsx" },
		{ code: `<a href="/docs">View Documentation</a>`, fileName: "file.tsx" },
		{
			code: `<a href="/contact">Contact Information</a>`,
			fileName: "file.tsx",
		},
		{
			code: `<a href="/pricing">See Pricing Details</a>`,
			fileName: "file.tsx",
		},
		{ code: `<a href="/download">Download the App</a>`, fileName: "file.tsx" },
		{ code: `<CustomLink>click here</CustomLink>`, fileName: "file.tsx" },
	],
});
