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
     Elements with the 'button' interactive role must be focusable.
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
      Elements with the 'button' interactive role must be focusable.
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
     Elements with the 'checkbox' interactive role must be focusable.
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
      Elements with the 'link' interactive role must be focusable.
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
     Elements with the 'menuitem' interactive role must be focusable.
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
     Elements with the 'tab' interactive role must be focusable.
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
     Elements with the 'textbox' interactive role must be focusable.
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
      Elements with the 'switch' interactive role must be focusable.
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
     Elements with the 'slider' interactive role must be focusable.
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
