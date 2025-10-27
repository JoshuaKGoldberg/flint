import rule from "./anchorContent.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<a />`,
			fileName: "file.tsx",
			snapshot: `<a />
~~~~~
Anchor elements must have accessible content.`,
		},
		{
			code: `<a></a>`,
			fileName: "file.tsx",
			snapshot: `<a></a>
~~~
Anchor elements must have accessible content.`,
		},
		{
			code: `<a><span aria-hidden /></a>`,
			fileName: "file.tsx",
			snapshot: `<a><span aria-hidden /></a>
~~~
Anchor elements must have accessible content.`,
		},
	],
	valid: [
		{ code: `<a>Link text</a>`, fileName: "file.tsx" },
		{ code: `<a><span>Link text</span></a>`, fileName: "file.tsx" },
		{ code: `<a aria-label="Link" />`, fileName: "file.tsx" },
		{ code: `<a aria-labelledby="label-id" />`, fileName: "file.tsx" },
		{ code: `<a title="Link title" />`, fileName: "file.tsx" },
		{
			code: `<a dangerouslySetInnerHTML={{ __html: 'foo' }} />`,
			fileName: "file.tsx",
		},
		{ code: `<a>{variable}</a>`, fileName: "file.tsx" },
	],
});
