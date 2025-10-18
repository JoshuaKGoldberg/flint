import rule from "./headingContents.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<h1 />`,
			fileName: "file.tsx",
			snapshot: `<h1 />
~~
Heading elements must have accessible content.
`,
		},
		{
			code: `<h2></h2>`,
			fileName: "file.tsx",
			snapshot: `<h2></h2>
~~
Heading elements must have accessible content.
`,
		},
		{
			code: `<h3>  </h3>`,
			fileName: "file.tsx",
			snapshot: `<h3>  </h3>
~~
Heading elements must have accessible content.
`,
		},
	],
	valid: [
		{ code: `<h1>Heading Content</h1>`, fileName: "file.tsx" },
		{ code: `<h2><TextWrapper /></h2>`, fileName: "file.tsx" },
		{
			code: `<h3 dangerouslySetInnerHTML={{ __html: 'foo' }} />`,
			fileName: "file.tsx",
		},
		{ code: `<h4 aria-label="Heading" />`, fileName: "file.tsx" },
		// cspell:disable-next-line -- aria-labelledby is correct spelling
		{ code: `<h5 aria-labelledby="heading-id" />`, fileName: "file.tsx" },
		{ code: `<div>Not a heading</div>`, fileName: "file.tsx" },
		{ code: `<h6>{content}</h6>`, fileName: "file.tsx" },
	],
});
