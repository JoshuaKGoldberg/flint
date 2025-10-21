import rule from "./ariaActiveDescendantTabIndex.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div aria-activedescendant={someID} />
`,
			fileName: "file.tsx",
			snapshot: `
<div aria-activedescendant={someID} />
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     This element with \`aria-activedescendant\` is missing a \`tabIndex\` attribute to manage focus state.
`,
		},
		{
			code: `
<span aria-activedescendant="item-1" />
`,
			fileName: "file.tsx",
			snapshot: `
<span aria-activedescendant="item-1" />
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      This element with \`aria-activedescendant\` is missing a \`tabIndex\` attribute to manage focus state.
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
		{
			code: `
<div />`,
			fileName: "file.tsx",
		},
		{ code: `<input />`, fileName: "file.tsx" },
		{
			code: `
<div tabIndex={0} />`,
			fileName: "file.tsx",
		},
		{
			code: `
<div aria-activedescendant={someID} tabIndex={0} />
`,
			fileName: "file.tsx",
		},
		{
			code: `
<div aria-activedescendant={someID} tabIndex="0" />
`,
			fileName: "file.tsx",
		},
		{
			code: `
<div aria-activedescendant={someID} tabIndex={1} />
`,
			fileName: "file.tsx",
		},
		{
			code: `
<div aria-activedescendant={someID} tabIndex={-1} />
`,
			fileName: "file.tsx",
		},
		{ code: `<input aria-activedescendant={someID} />`, fileName: "file.tsx" },
		{ code: `<button aria-activedescendant={someID} />`, fileName: "file.tsx" },
	],
});
