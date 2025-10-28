import rule from "./roleRedundancies.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<button role="button" />
`,
			fileName: "file.tsx",
			snapshot: `
<button role="button" />
        ~~~~~~~~~~~~~
        \`<button>\` elements already implicitly have a role of \`button\`. This explicit role is unnecessary.
`,
			suggestions: [
				{
					id: "removeRole",
					updated: `
<button  />
`,
				},
			],
		},
		{
			code: `
<img role="img" src="/image.jpg" />
`,
			fileName: "file.tsx",
			snapshot: `
<img role="img" src="/image.jpg" />
     ~~~~~~~~~~
     \`<img>\` elements already implicitly have a role of \`img\`. This explicit role is unnecessary.
`,
			suggestions: [
				{
					id: "removeRole",
					updated: `
<img  src="/image.jpg" />
`,
				},
			],
		},
		{
			code: `
<nav role="navigation" />
`,
			fileName: "file.tsx",
			snapshot: `
<nav role="navigation" />
     ~~~~~~~~~~~~~~~~~
     \`<nav>\` elements already implicitly have a role of \`navigation\`. This explicit role is unnecessary.
`,
			suggestions: [
				{
					id: "removeRole",
					updated: `
<nav  />
`,
				},
			],
		},
		{
			code: `
<main role="main" style="" />
`,
			fileName: "file.tsx",
			snapshot: `
<main role="main" style="" />
      ~~~~~~~~~~~
      \`<main>\` elements already implicitly have a role of \`main\`. This explicit role is unnecessary.
`,
			suggestions: [
				{
					id: "removeRole",
					updated: `
<main  style="" />
`,
				},
			],
		},
	],
	valid: [
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<button role="presentation" />`, fileName: "file.tsx" },
		{ code: `<div role="button" />`, fileName: "file.tsx" },
		{ code: `<img src="/image.jpg" />`, fileName: "file.tsx" },
		{ code: `<nav />`, fileName: "file.tsx" },
		{ code: `<button />`, fileName: "file.tsx" },
	],
});
