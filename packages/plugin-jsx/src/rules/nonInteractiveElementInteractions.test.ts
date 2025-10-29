import rule from "./nonInteractiveElementInteractions.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<h1 onClick={() => {}} />
`,
			fileName: "file.tsx",
			snapshot: `
<h1 onClick={() => {}} />
 ~~
 \`<h1>\` elements are non-interactive and so should not have interactive event handlers.
`,
		},
		{
			code: `
<main onKeyDown={handler} />
`,
			fileName: "file.tsx",
			snapshot: `
<main onKeyDown={handler} />
 ~~~~
 \`<main>\` elements are non-interactive and so should not have interactive event handlers.
`,
		},
		{
			code: `
<p onMouseDown={() => {}} />
`,
			fileName: "file.tsx",
			snapshot: `
<p onMouseDown={() => {}} />
 ~
 \`<p>\` elements are non-interactive and so should not have interactive event handlers.
`,
		},
		{
			code: `
<img onClick={handler} />
`,
			fileName: "file.tsx",
			snapshot: `
<img onClick={handler} />
 ~~~
 \`<img>\` elements are non-interactive and so should not have interactive event handlers.
`,
		},
		{
			code: `
<li onClick={() => {}} />
`,
			fileName: "file.tsx",
			snapshot: `
<li onClick={() => {}} />
 ~~
 \`<li>\` elements are non-interactive and so should not have interactive event handlers.
`,
		},
		{
			code: `
<ul onKeyPress={handler} />
`,
			fileName: "file.tsx",
			snapshot: `
<ul onKeyPress={handler} />
 ~~
 \`<ul>\` elements are non-interactive and so should not have interactive event handlers.
`,
		},
		{
			code: `
<section onClick={handler} role="article" />
`,
			fileName: "file.tsx",
			snapshot: `
<section onClick={handler} role="article" />
 ~~~~~~~
 \`<section>\` elements are non-interactive and so should not have interactive event handlers.
`,
		},
	],
	valid: [
		{ code: `<h1 />`, fileName: "file.tsx" },
		{ code: `<main />`, fileName: "file.tsx" },
		{ code: `<p>Some text</p>`, fileName: "file.tsx" },
		{ code: `<button onClick={() => {}} />`, fileName: "file.tsx" },
		{ code: `<a onClick={() => {}} />`, fileName: "file.tsx" },
		{ code: `<input onClick={() => {}} />`, fileName: "file.tsx" },
		{ code: `<div onClick={() => {}} role="button" />`, fileName: "file.tsx" },
		{ code: `<h1 onClick={() => {}} role="button" />`, fileName: "file.tsx" },
		{ code: `<li onClick={() => {}} role="menuitem" />`, fileName: "file.tsx" },
		{
			code: `<span onClick={() => {}} role="checkbox" />`,
			fileName: "file.tsx",
		},
		{ code: `<CustomElement onClick={() => {}} />`, fileName: "file.tsx" },
	],
});
