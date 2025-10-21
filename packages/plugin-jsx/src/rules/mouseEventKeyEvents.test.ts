import rule from "./mouseEventKeyEvents.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div onMouseOver={() => void 0} />
`,
			fileName: "file.tsx",
			snapshot: `
<div onMouseOver={() => void 0} />
     ~~~~~~~~~~~
     \`onMouseOver\` is missing an accompanying \`onFocus\` for keyboard accessibility.
`,
		},
		{
			code: `
<div onMouseOut={() => void 0} />
`,
			fileName: "file.tsx",
			snapshot: `
<div onMouseOut={() => void 0} />
     ~~~~~~~~~~
     \`onMouseOut\` is missing an accompanying \`onBlur\` for keyboard accessibility.
`,
		},
		{
			code: `
<button onMouseOver={handler} />
`,
			fileName: "file.tsx",
			snapshot: `
<button onMouseOver={handler} />
        ~~~~~~~~~~~
        \`onMouseOver\` is missing an accompanying \`onFocus\` for keyboard accessibility.
`,
		},
	],
	valid: [
		{
			code: `<div onMouseOver={() => void 0} onFocus={() => void 0} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div onMouseOut={() => void 0} onBlur={() => void 0} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div onFocus={() => void 0} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div />`,
			fileName: "file.tsx",
		},
		{ code: `<button onClick={handler} />`, fileName: "file.tsx" },
	],
});
