import { ruleTester } from "./ruleTester.js";
import rule from "./tabIndexPositiveValues.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<span tabIndex="5">foo</span>`,
			fileName: "file.tsx",
			snapshot: `<span tabIndex="5">foo</span>
     ~~~~~~~~~~~~
     Avoid positive \`tabIndex\` values.
`,
		},
		{
			code: `<span tabIndex="1">bar</span>`,
			fileName: "file.tsx",
			snapshot: `<span tabIndex="1">bar</span>
     ~~~~~~~~~~~~
     Avoid positive \`tabIndex\` values.
`,
		},
		{
			code: `<div tabIndex={3}>baz</div>`,
			fileName: "file.tsx",
			snapshot: `<div tabIndex={3}>baz</div>
    ~~~~~~~~~~~~
    Avoid positive \`tabIndex\` values.
`,
		},
		{
			code: `<button tabIndex={100}>Click</button>`,
			fileName: "file.tsx",
			snapshot: `<button tabIndex={100}>Click</button>
       ~~~~~~~~~~~~~~
       Avoid positive \`tabIndex\` values.
`,
		},
	],
	valid: [
		{ code: `<span tabIndex="0">foo</span>`, fileName: "file.tsx" },
		{ code: `<span tabIndex="-1">bar</span>`, fileName: "file.tsx" },
		{ code: `<span tabIndex={0}>baz</span>`, fileName: "file.tsx" },
		{ code: `<span tabIndex={-1}>qux</span>`, fileName: "file.tsx" },
		{ code: `<div>no tabIndex</div>`, fileName: "file.tsx" },
		{ code: `<button>Click me</button>`, fileName: "file.tsx" },
	],
});
