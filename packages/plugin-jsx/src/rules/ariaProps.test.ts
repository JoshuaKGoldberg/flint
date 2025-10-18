import rule from "./ariaProps.js";
import { ruleTester } from "./ruleTester.js";

// cspell:disable -- Testing misspellings of ARIA attributes
ruleTester.describe(rule, {
	invalid: [
		{
			code: `<input aria-labeledby="address_label" />`,
			fileName: "file.tsx",
			snapshot: `<input aria-labeledby="address_label" />
      ~~~~~~~~~~~~~~
      Invalid ARIA property: \`aria-labeledby\`.
`,
		},
		{
			code: `<div aria-invalid-prop="true" />`,
			fileName: "file.tsx",
			snapshot: `<div aria-invalid-prop="true" />
    ~~~~~~~~~~~~~~~~~
    Invalid ARIA property: \`aria-invalid-prop\`.
`,
		},
		{
			code: `<button aria-labelled="Submit" />`,
			fileName: "file.tsx",
			snapshot: `<button aria-labelled="Submit" />
       ~~~~~~~~~~~~~
       Invalid ARIA property: \`aria-labelled\`.
`,
		},
	],
	valid: [
		{ code: `<input aria-labelledby="address_label" />`, fileName: "file.tsx" },
		{ code: `<div aria-label="Section" />`, fileName: "file.tsx" },
		{ code: `<button aria-pressed="true" />`, fileName: "file.tsx" },
		{ code: `<div aria-hidden="true" />`, fileName: "file.tsx" },
		{ code: `<input aria-required="true" />`, fileName: "file.tsx" },
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<input data-aria-label="test" />`, fileName: "file.tsx" },
	],
});
