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
 Non-interactive element <h1> should not have interactive event handlers.
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
 Non-interactive element <main> should not have interactive event handlers.
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
 Non-interactive element <p> should not have interactive event handlers.
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
 Non-interactive element <img> should not have interactive event handlers.
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
 Non-interactive element <li> should not have interactive event handlers.
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
 Non-interactive element <ul> should not have interactive event handlers.
`,
		},
		{
			code: `
<div onClick={handler} role="article" />
`,
			fileName: "file.tsx",
			snapshot: `
<div onClick={handler} role="article" />
 ~~~
 Non-interactive element <div> should not have interactive event handlers.
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
