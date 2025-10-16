import rule from "./accessKeys.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<button accessKey="h">Help</button>
`,
			fileName: "file.tsx",
			snapshot: `
<button accessKey="h">Help</button>
        ~~~~~~~~~
        The native DOM \`accessKey\` prop causes accessibility issues with keyboard-only users and screen readers.
`,
		},
		{
			code: `
<div accesskey="x">Something</div>
`,
			fileName: "file.tsx",
			snapshot: `
<div accesskey="x">Something</div>
     ~~~~~~~~~
     The native DOM \`accesskey\` prop causes accessibility issues with keyboard-only users and screen readers.
`,
		},
	],
	valid: [
		{ code: `<button>Click me</button>`, fileName: "file.tsx" },
		{
			code: `<div className="accessKey">not an attribute</div>`,
			fileName: "file.tsx",
		},
		{ code: `const a = <span />;`, fileName: "file.tsx" },
	],
});
