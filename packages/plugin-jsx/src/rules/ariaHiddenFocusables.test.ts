// cspell:disable-next-line -- ariaHiddenFocusables is the rule name
import rule from "./ariaHiddenFocusables.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<div aria-hidden="true" tabIndex="0" />`,
			fileName: "file.tsx",
			snapshot: `<div aria-hidden="true" tabIndex="0" />
    ~~~~~~~~~~~~~~~~~~
    This element has \`aria-hidden="true"\` but is focusable, which can confuse screen reader users.
`,
		},
		{
			code: `<input aria-hidden="true" />`,
			fileName: "file.tsx",
			snapshot: `<input aria-hidden="true" />
      ~~~~~~~~~~~~~~~~~~
      This element has \`aria-hidden="true"\` but is focusable, which can confuse screen reader users.
`,
		},
		{
			code: `<a href="/" aria-hidden="true" />`,
			fileName: "file.tsx",
			snapshot: `<a href="/" aria-hidden="true" />
           ~~~~~~~~~~~~~~~~~~
           This element has \`aria-hidden="true"\` but is focusable, which can confuse screen reader users.
`,
		},
		{
			code: `<button aria-hidden="true" />`,
			fileName: "file.tsx",
			snapshot: `<button aria-hidden="true" />
       ~~~~~~~~~~~~~~~~~~
       This element has \`aria-hidden="true"\` but is focusable, which can confuse screen reader users.
`,
		},
		{
			code: `<textarea aria-hidden="true" />`,
			fileName: "file.tsx",
			snapshot: `<textarea aria-hidden="true" />
         ~~~~~~~~~~~~~~~~~~
         This element has \`aria-hidden="true"\` but is focusable, which can confuse screen reader users.
`,
		},
		{
			code: `<div aria-hidden={true} tabIndex={0} />`,
			fileName: "file.tsx",
			snapshot: `<div aria-hidden={true} tabIndex={0} />
    ~~~~~~~~~~~~~~~~~~
    This element has \`aria-hidden="true"\` but is focusable, which can confuse screen reader users.
`,
		},
	],
	valid: [
		{ code: `<div aria-hidden="true" />`, fileName: "file.tsx" },
		{ code: `<img aria-hidden="true" />`, fileName: "file.tsx" },
		{ code: `<a aria-hidden="false" href="#" />`, fileName: "file.tsx" },
		{
			code: `<button aria-hidden="true" tabIndex="-1" />`,
			fileName: "file.tsx",
		},
		{ code: `<a href="/" />`, fileName: "file.tsx" },
		{ code: `<div aria-hidden="false" tabIndex="0" />`, fileName: "file.tsx" },
		{ code: `<button />`, fileName: "file.tsx" },
	],
});
