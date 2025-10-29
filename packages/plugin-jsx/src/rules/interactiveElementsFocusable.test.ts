import rule from "./interactiveElementsFocusable.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div role="button" onClick={() => {}} />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="button" onClick={() => {}} />
     ~~~~~~~~~~~~~
     The 'button' role makes this element interactive, so it should also be focusable.
`,
		},
		{
			code: `
<span role="button" onClick={() => {}} />
`,
			fileName: "file.tsx",
			snapshot: `
<span role="button" onClick={() => {}} />
      ~~~~~~~~~~~~~
      The 'button' role makes this element interactive, so it should also be focusable.
`,
		},
		{
			code: `
<div role="checkbox" onClick={() => {}} />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="checkbox" onClick={() => {}} />
     ~~~~~~~~~~~~~~~
     The 'checkbox' role makes this element interactive, so it should also be focusable.
`,
		},
		{
			code: `
<span role="link" onClick={() => {}} />
`,
			fileName: "file.tsx",
			snapshot: `
<span role="link" onClick={() => {}} />
      ~~~~~~~~~~~
      The 'link' role makes this element interactive, so it should also be focusable.
`,
		},
		{
			code: `
<div role="menuitem" onKeyDown={() => {}} />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="menuitem" onKeyDown={() => {}} />
     ~~~~~~~~~~~~~~~
     The 'menuitem' role makes this element interactive, so it should also be focusable.
`,
		},
		{
			code: `
<div role="tab" onKeyPress={() => {}} />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="tab" onKeyPress={() => {}} />
     ~~~~~~~~~~
     The 'tab' role makes this element interactive, so it should also be focusable.
`,
		},
		{
			code: `
<div role="textbox" onKeyUp={() => {}} />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="textbox" onKeyUp={() => {}} />
     ~~~~~~~~~~~~~~
     The 'textbox' role makes this element interactive, so it should also be focusable.
`,
		},
		{
			code: `
<span role="switch" onMouseDown={() => {}} />
`,
			fileName: "file.tsx",
			snapshot: `
<span role="switch" onMouseDown={() => {}} />
      ~~~~~~~~~~~~~
      The 'switch' role makes this element interactive, so it should also be focusable.
`,
		},
		{
			code: `
<div role="slider" onMouseUp={() => {}} />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="slider" onMouseUp={() => {}} />
     ~~~~~~~~~~~~~
     The 'slider' role makes this element interactive, so it should also be focusable.
`,
		},
	],
	valid: [
		{ code: `<button onClick={() => {}} />`, fileName: "file.tsx" },
		{ code: `<a href="#" onClick={() => {}} />`, fileName: "file.tsx" },
		{ code: `<input onClick={() => {}} />`, fileName: "file.tsx" },
		{ code: `<select onChange={() => {}} />`, fileName: "file.tsx" },
		{ code: `<textarea onChange={() => {}} />`, fileName: "file.tsx" },
		{
			code: `<div role="button" tabIndex={0} onClick={() => {}} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div role="button" tabIndex="-1" onClick={() => {}} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div role="button" tabIndex="0" onClick={() => {}} />`,
			fileName: "file.tsx",
		},
		{
			code: `<span role="link" tabIndex={0} onClick={() => {}} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div role="checkbox" tabIndex={0} onClick={() => {}} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div onClick={() => {}} aria-hidden="true" />`,
			fileName: "file.tsx",
		},
		{
			code: `<div onClick={() => {}} aria-hidden={true} />`,
			fileName: "file.tsx",
		},
		{ code: `<button onClick={() => {}} disabled />`, fileName: "file.tsx" },
		{
			code: `<button onClick={() => {}} disabled={true} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div role="presentation" onClick={() => {}} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div role="none" onClick={() => {}} />`,
			fileName: "file.tsx",
		},
		{ code: `<div onClick={() => {}} />`, fileName: "file.tsx" },
		{ code: `<span onClick={() => {}} />`, fileName: "file.tsx" },
		{
			code: `<div role="article" onClick={() => {}} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div role="banner" onClick={() => {}} />`,
			fileName: "file.tsx",
		},
		{ code: `<div role="button" />`, fileName: "file.tsx" },
		{ code: `<button />`, fileName: "file.tsx" },
	],
});
