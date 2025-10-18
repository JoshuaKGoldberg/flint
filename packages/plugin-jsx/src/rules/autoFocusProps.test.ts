import rule from "./autoFocusProps.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<div autoFocus />`,
			fileName: "file.tsx",
			snapshot: `<div autoFocus />
    ~~~~~~~~~
    Avoid using the \`autoFocus\` prop.
`,
		},
		{
			code: `<div autoFocus="true" />`,
			fileName: "file.tsx",
			snapshot: `<div autoFocus="true" />
    ~~~~~~~~~~~~~~~~
    Avoid using the \`autoFocus\` prop.
`,
		},
		{
			code: `<div autoFocus={true} />`,
			fileName: "file.tsx",
			snapshot: `<div autoFocus={true} />
    ~~~~~~~~~~~~~~~~
    Avoid using the \`autoFocus\` prop.
`,
		},
		{
			code: `<input autoFocus={undefined} />`,
			fileName: "file.tsx",
			snapshot: `<input autoFocus={undefined} />
      ~~~~~~~~~~~~~~~~~~~~~
      Avoid using the \`autoFocus\` prop.
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
