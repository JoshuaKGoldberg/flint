import rule from "./elementChildrenValidity.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<br>text</br>
`,
			fileName: "file.tsx",
			snapshot: `
<br>text</br>
 ~~
 The \`<br>\` element is a void element and cannot have children.
`,
		},
		{
			code: `
<img>child content</img>
`,
			fileName: "file.tsx",
			snapshot: `
<img>child content</img>
 ~~~
 The \`<img>\` element is a void element and cannot have children.
`,
		},
		{
			code: `
<input><span>Invalid</span></input>
`,
			fileName: "file.tsx",
			snapshot: `
<input><span>Invalid</span></input>
 ~~~~~
 The \`<input>\` element is a void element and cannot have children.
`,
		},
		{
			code: `
<hr>{expression}</hr>
`,
			fileName: "file.tsx",
			snapshot: `
<hr>{expression}</hr>
 ~~
 The \`<hr>\` element is a void element and cannot have children.
`,
		},
		{
			code: `
<meta>
    <div>Content</div>
</meta>
`,
			fileName: "file.tsx",
			snapshot: `
<meta>
 ~~~~
 The \`<meta>\` element is a void element and cannot have children.
    <div>Content</div>
</meta>
`,
		},
		{
			code: `
<area>text content</area>
`,
			fileName: "file.tsx",
			snapshot: `
<area>text content</area>
 ~~~~
 The \`<area>\` element is a void element and cannot have children.
`,
		},
		{
			code: `
<base>
    content
</base>
`,
			fileName: "file.tsx",
			snapshot: `
<base>
 ~~~~
 The \`<base>\` element is a void element and cannot have children.
    content
</base>
`,
		},
		{
			code: `
<col><td>data</td></col>
`,
			fileName: "file.tsx",
			snapshot: `
<col><td>data</td></col>
 ~~~
 The \`<col>\` element is a void element and cannot have children.
`,
		},
		{
			code: `
<embed>child</embed>
`,
			fileName: "file.tsx",
			snapshot: `
<embed>child</embed>
 ~~~~~
 The \`<embed>\` element is a void element and cannot have children.
`,
		},
		{
			code: `
<link>content</link>
`,
			fileName: "file.tsx",
			snapshot: `
<link>content</link>
 ~~~~
 The \`<link>\` element is a void element and cannot have children.
`,
		},
		{
			code: `
<param>value</param>
`,
			fileName: "file.tsx",
			snapshot: `
<param>value</param>
 ~~~~~
 The \`<param>\` element is a void element and cannot have children.
`,
		},
		{
			code: `
<source>media</source>
`,
			fileName: "file.tsx",
			snapshot: `
<source>media</source>
 ~~~~~~
 The \`<source>\` element is a void element and cannot have children.
`,
		},
		{
			code: `
<track>subtitle</track>
`,
			fileName: "file.tsx",
			snapshot: `
<track>subtitle</track>
 ~~~~~
 The \`<track>\` element is a void element and cannot have children.
`,
		},
		{
			code: `
<wbr>text</wbr>
`,
			fileName: "file.tsx",
			snapshot: `
<wbr>text</wbr>
 ~~~
 The \`<wbr>\` element is a void element and cannot have children.
`,
		},
	],
	valid: [
		{ code: `<br />`, fileName: "file.tsx" },
		{ code: `<img src="test.jpg" />`, fileName: "file.tsx" },
		{ code: `<input type="text" />`, fileName: "file.tsx" },
		{ code: `<hr />`, fileName: "file.tsx" },
		{ code: `<meta name="viewport" />`, fileName: "file.tsx" },
		{ code: `<link rel="stylesheet" />`, fileName: "file.tsx" },
		{ code: `<div>Content</div>`, fileName: "file.tsx" },
		{ code: `<span><br /></span>`, fileName: "file.tsx" },
		{
			code: `<CustomComponent>children</CustomComponent>`,
			fileName: "file.tsx",
		},
		{ code: `<Button>Click me</Button>`, fileName: "file.tsx" },
		{ code: `<area />`, fileName: "file.tsx" },
		{ code: `<base />`, fileName: "file.tsx" },
		{ code: `<col />`, fileName: "file.tsx" },
		{ code: `<embed />`, fileName: "file.tsx" },
		{ code: `<param />`, fileName: "file.tsx" },
		{ code: `<source />`, fileName: "file.tsx" },
		{ code: `<track />`, fileName: "file.tsx" },
		{ code: `<wbr />`, fileName: "file.tsx" },
	],
});
