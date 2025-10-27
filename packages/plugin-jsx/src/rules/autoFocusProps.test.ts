import rule from "./autoFocusProps.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div autoFocus />
`,
			fileName: "file.tsx",
			snapshot: `
<div autoFocus />
     ~~~~~~~~~
     The \`autoFocus\` prop disruptively forces unintuitive focus behavior.
`,
		},
		{
			code: `
<div autoFocus="true" />
`,
			fileName: "file.tsx",
			snapshot: `
<div autoFocus="true" />
     ~~~~~~~~~~~~~~~~
     The \`autoFocus\` prop disruptively forces unintuitive focus behavior.
`,
		},
		{
			code: `
<div autoFocus={true} />
`,
			fileName: "file.tsx",
			snapshot: `
<div autoFocus={true} />
     ~~~~~~~~~~~~~~~~
     The \`autoFocus\` prop disruptively forces unintuitive focus behavior.
`,
		},
		{
			code: `
<input autoFocus={undefined} />
`,
			fileName: "file.tsx",
			snapshot: `
<input autoFocus={undefined} />
       ~~~~~~~~~~~~~~~~~~~~~
       The \`autoFocus\` prop disruptively forces unintuitive focus behavior.
`,
		},
	],
	valid: [
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<div autoFocus="false" />`, fileName: "file.tsx" },
		{ code: `<div autoFocus={false} />`, fileName: "file.tsx" },
		{ code: `<input type="text" />`, fileName: "file.tsx" },
	],
});
