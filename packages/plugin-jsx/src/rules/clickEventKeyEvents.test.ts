import rule from "./clickEventKeyEvents.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div onClick={() => {}} />
`,
			fileName: "file.tsx",
			snapshot: `
<div onClick={() => {}} />
     ~~~~~~~~~~~~~~~~~~
     This \`onClick\` is missing accompanying \`onKeyUp\`, \`onKeyDown\`, and/or \`onKeyPress\` keyboard events.
`,
		},
		{
			code: `
<span onClick={handler} />
`,
			fileName: "file.tsx",
			snapshot: `
<span onClick={handler} />
      ~~~~~~~~~~~~~~~~~
      This \`onClick\` is missing accompanying \`onKeyUp\`, \`onKeyDown\`, and/or \`onKeyPress\` keyboard events.
`,
		},
	],
	valid: [
		{
			code: `<div onClick={() => {}} onKeyDown={handler} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div onClick={() => {}} onKeyUp={handler} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div onClick={() => {}} onKeyPress={handler} />`,
			fileName: "file.tsx",
		},
		{ code: `<button onClick={() => {}} />`, fileName: "file.tsx" },
		{
			code: `<div onClick={() => {}} aria-hidden="true" />`,
			fileName: "file.tsx",
		},
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<input onClick={() => {}} />`, fileName: "file.tsx" },
		{
			code: `<CustomElement onClick={() => {}} />`,
			fileName: "file.tsx",
		},
	],
});
