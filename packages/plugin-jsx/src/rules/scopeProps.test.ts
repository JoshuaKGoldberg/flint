import { ruleTester } from "./ruleTester.js";
import rule from "./scopeProps.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<div scope />`,
			fileName: "file.tsx",
			snapshot: `<div scope />
    ~~~~~
    The \`scope\` prop should only be used on <th> elements.
`,
		},
		{
			code: `<div scope="col" />`,
			fileName: "file.tsx",
			snapshot: `<div scope="col" />
    ~~~~~~~~~~~
    The \`scope\` prop should only be used on <th> elements.
`,
		},
		{
			code: `<td scope="row" />`,
			fileName: "file.tsx",
			snapshot: `<td scope="row" />
   ~~~~~~~~~~~
   The \`scope\` prop should only be used on <th> elements.
`,
		},
		{
			code: `<span scope={scope} />`,
			fileName: "file.tsx",
			snapshot: `<span scope={scope} />
     ~~~~~~~~~~~~~
     The \`scope\` prop should only be used on <th> elements.
`,
		},
	],
	valid: [
		{ code: `<th scope="col" />`, fileName: "file.tsx" },
		{ code: `<th scope="row" />`, fileName: "file.tsx" },
		{ code: `<th scope={scope} />`, fileName: "file.tsx" },
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<td>Cell</td>`, fileName: "file.tsx" },
	],
});
