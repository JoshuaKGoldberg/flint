import rule from "./ruleSupportedAriaProps.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div role="button" aria-checked="true" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="button" aria-checked="true" />
                   ~~~~~~~~~~~~
                   The \`aria-checked\` ARIA property is not supported by the \`button\` role.
`,
		},
		{
			code: `
<div role="link" aria-selected="true" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="link" aria-selected="true" />
                 ~~~~~~~~~~~~~
                 The \`aria-selected\` ARIA property is not supported by the \`link\` role.
`,
		},
		{
			code: `
<button aria-checked="false" />
`,
			fileName: "file.tsx",
			snapshot: `
<button aria-checked="false" />
        ~~~~~~~~~~~~
        The \`aria-checked\` ARIA property is not supported by the \`button\` role.
`,
		},
		{
			code: `
<div role="checkbox" aria-selected="true" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="checkbox" aria-selected="true" />
                     ~~~~~~~~~~~~~
                     The \`aria-selected\` ARIA property is not supported by the \`checkbox\` role.
`,
		},
		{
			code: `
<img aria-checked="true" />
`,
			fileName: "file.tsx",
			snapshot: `
<img aria-checked="true" />
     ~~~~~~~~~~~~
     The \`aria-checked\` ARIA property is not supported by the \`img\` role.
`,
		},
	],
	valid: [
		{ code: `<div role="button" aria-pressed="true" />`, fileName: "file.tsx" },
		{ code: `<button aria-pressed="true" />`, fileName: "file.tsx" },
		{
			code: `<div role="checkbox" aria-checked="true" />`,
			fileName: "file.tsx",
		},
		{
			code: `<div role="checkbox" aria-required="true" />`,
			fileName: "file.tsx",
		},
		{
			code: `<div role="link" aria-label="Click here" />`,
			fileName: "file.tsx",
		},
		{ code: `<button aria-label="Submit" />`, fileName: "file.tsx" },
		{ code: `<div aria-label="Section" />`, fileName: "file.tsx" },
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<button />`, fileName: "file.tsx" },
	],
});
