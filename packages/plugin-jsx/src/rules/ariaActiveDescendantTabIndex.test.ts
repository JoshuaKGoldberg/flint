import rule from "./ariaActiveDescendantTabIndex.js";
import { ruleTester } from "./ruleTester.js";

// cspell:disable -- activedescendant is correct spelling
ruleTester.describe(rule, {
	invalid: [
		{
			code: `<div aria-activedescendant={someID} />`,
			fileName: "file.tsx",
			snapshot: `<div aria-activedescendant={someID} />
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Elements with \`aria-activedescendant\` must have a \`tabIndex\` attribute.
`,
		},
		{
			code: `<span aria-activedescendant="item-1" />`,
			fileName: "file.tsx",
			snapshot: `<span aria-activedescendant="item-1" />
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     Elements with \`aria-activedescendant\` must have a \`tabIndex\` attribute.
`,
		},
	],
	valid: [
		{ code: `<CustomComponent />`, fileName: "file.tsx" },
		{
			code: `<CustomComponent aria-activedescendant={someID} />`,
			fileName: "file.tsx",
		},
		{
			code: `<CustomComponent aria-activedescendant={someID} tabIndex={0} />`,
			fileName: "file.tsx",
		},
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<input />`, fileName: "file.tsx" },
		{ code: `<div tabIndex={0} />`, fileName: "file.tsx" },
		{
			code: `<div aria-activedescendant={someID} tabIndex={0} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div aria-activedescendant={someID} tabIndex="0" />`,
			fileName: "file.tsx",
		},
		{
			code: `<div aria-activedescendant={someID} tabIndex={1} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div aria-activedescendant={someID} tabIndex={-1} />`,
			fileName: "file.tsx",
		},
		{ code: `<input aria-activedescendant={someID} />`, fileName: "file.tsx" },
		{ code: `<button aria-activedescendant={someID} />`, fileName: "file.tsx" },
	],
});
