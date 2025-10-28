import rule from "./anchorAmbiguousText.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<a>here</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a>here</a>
 ~
 Prefer descriptive anchor text over 'here'.
`,
		},
		{
			code: `
<a>HERE</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a>HERE</a>
 ~
 Prefer descriptive anchor text over 'here'.
`,
		},
		{
			code: `
<a>link</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a>link</a>
 ~
 Prefer descriptive anchor text over 'link'.
`,
		},
		{
			code: `
<a>click here</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a>click here</a>
 ~
 Prefer descriptive anchor text over 'click here'.
`,
		},
		{
			code: `
<a>learn more</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a>learn more</a>
 ~
 Prefer descriptive anchor text over 'learn more'.
`,
		},
		{
			code: `
<a>learn more.</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a>learn more.</a>
 ~
 Prefer descriptive anchor text over 'learn more'.
`,
		},
		{
			code: `
<a>learn more,</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a>learn more,</a>
 ~
 Prefer descriptive anchor text over 'learn more'.
`,
		},
		{
			code: `
<a>learn more?</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a>learn more?</a>
 ~
 Prefer descriptive anchor text over 'learn more'.
`,
		},
		{
			code: `
<a>learn more!</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a>learn more!</a>
 ~
 Prefer descriptive anchor text over 'learn more'.
`,
		},
		{
			code: `
<a>learn more:</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a>learn more:</a>
 ~
 Prefer descriptive anchor text over 'learn more'.
`,
		},
		{
			code: `
<a>learn more;</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a>learn more;</a>
 ~
 Prefer descriptive anchor text over 'learn more'.
`,
		},
		{
			code: `
<a>a link</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a>a link</a>
 ~
 Prefer descriptive anchor text over 'a link'.
`,
		},
		{
			code: `
<a> a link </a>
`,
			fileName: "file.tsx",
			snapshot: `
<a> a link </a>
 ~
 Prefer descriptive anchor text over 'a link'.
`,
		},
		{
			code: `
<a><span> click </span> here</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a><span> click </span> here</a>
 ~
 Prefer descriptive anchor text over 'click here'.
`,
		},
		{
			code: `
<a>a<i></i> link</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a>a<i></i> link</a>
 ~
 Prefer descriptive anchor text over 'a link'.
`,
		},
		{
			code: `
<a><i></i>a link</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a><i></i>a link</a>
 ~
 Prefer descriptive anchor text over 'a link'.
`,
		},
		{
			code: `
<a><span aria-hidden="true">more text</span>learn more</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a><span aria-hidden="true">more text</span>learn more</a>
 ~
 Prefer descriptive anchor text over 'learn more'.
`,
		},
		{
			code: `
<a aria-label="click here">something</a>
`,
			fileName: "file.tsx",
			snapshot: `
<a aria-label="click here">something</a>
 ~
 Prefer descriptive anchor text over 'click here'.
`,
		},
		{
			code: `
<a><img alt="click here"/></a>
`,
			fileName: "file.tsx",
			snapshot: `
<a><img alt="click here"/></a>
 ~
 Prefer descriptive anchor text over 'click here'.
`,
		},
	],
	valid: [
		{ code: `<a>read this tutorial</a>`, fileName: "file.tsx" },
		{ code: "<a>${here}</a>", fileName: "file.tsx" },
		{
			code: `<a aria-label="tutorial on using eslint-plugin-jsx-a11y">click here</a>`,
			fileName: "file.tsx",
		},
		{ code: `<a>Learn more about accessibility</a>`, fileName: "file.tsx" },
		{ code: `<a>Click here to read more</a>`, fileName: "file.tsx" },
		{ code: `<CustomElement>here</CustomElement>`, fileName: "file.tsx" },
		{ code: `<a>View documentation</a>`, fileName: "file.tsx" },
	],
});
