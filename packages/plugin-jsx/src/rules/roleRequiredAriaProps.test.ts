import rule from "./roleRequiredAriaProps.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div role="checkbox" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="checkbox" />
     ~~~~~~~~~~~~~~~
     Elements with ARIA role \`checkbox\` must have the following ARIA properties defined: aria-checked.
`,
		},
		{
			code: `
<span role="combobox" />
`,
			fileName: "file.tsx",
			snapshot: `
<span role="combobox" />
      ~~~~~~~~~~~~~~~
      Elements with ARIA role \`combobox\` must have the following ARIA properties defined: aria-controls, aria-expanded.
`,
		},
		{
			code: `
<div role="heading" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="heading" />
     ~~~~~~~~~~~~~~
     Elements with ARIA role \`heading\` must have the following ARIA properties defined: aria-level.
`,
		},
		{
			code: `
<div role="menuitemcheckbox" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="menuitemcheckbox" />
     ~~~~~~~~~~~~~~~~~~~~~~~
     Elements with ARIA role \`menuitemcheckbox\` must have the following ARIA properties defined: aria-checked.
`,
		},
		{
			code: `
<div role="menuitemradio" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="menuitemradio" />
     ~~~~~~~~~~~~~~~~~~~~
     Elements with ARIA role \`menuitemradio\` must have the following ARIA properties defined: aria-checked.
`,
		},
		{
			code: `
<div role="option" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="option" />
     ~~~~~~~~~~~~~
     Elements with ARIA role \`option\` must have the following ARIA properties defined: aria-selected.
`,
		},
		{
			code: `
<div role="radio" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="radio" />
     ~~~~~~~~~~~~
     Elements with ARIA role \`radio\` must have the following ARIA properties defined: aria-checked.
`,
		},
		{
			code: `
<div role="scrollbar" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="scrollbar" />
     ~~~~~~~~~~~~~~~~
     Elements with ARIA role \`scrollbar\` must have the following ARIA properties defined: aria-controls, aria-valuenow, aria-valuemax, aria-valuemin.
`,
		},
		{
			code: `
<div role="slider" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="slider" />
     ~~~~~~~~~~~~~
     Elements with ARIA role \`slider\` must have the following ARIA properties defined: aria-valuenow, aria-valuemax, aria-valuemin.
`,
		},
		{
			code: `
<div role="spinbutton" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="spinbutton" />
     ~~~~~~~~~~~~~~~~~
     Elements with ARIA role \`spinbutton\` must have the following ARIA properties defined: aria-valuenow, aria-valuemax, aria-valuemin.
`,
		},
		{
			code: `
<button role="switch" />
`,
			fileName: "file.tsx",
			snapshot: `
<button role="switch" />
        ~~~~~~~~~~~~~
        Elements with ARIA role \`switch\` must have the following ARIA properties defined: aria-checked.
`,
		},
		{
			code: `
<div role="checkbox" aria-label="Accept terms" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="checkbox" aria-label="Accept terms" />
     ~~~~~~~~~~~~~~~
     Elements with ARIA role \`checkbox\` must have the following ARIA properties defined: aria-checked.
`,
		},
		{
			code: `
<div role="slider" aria-valuenow="5" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="slider" aria-valuenow="5" />
     ~~~~~~~~~~~~~
     Elements with ARIA role \`slider\` must have the following ARIA properties defined: aria-valuemax, aria-valuemin.
`,
		},
	],
	valid: [
		{
			code: `<div role="checkbox" aria-checked="false" />`,
			fileName: "file.tsx",
		},
		{
			code: `<div role="combobox" aria-controls="listbox" aria-expanded="false" />`,
			fileName: "file.tsx",
		},
		{ code: `<div role="heading" aria-level="2" />`, fileName: "file.tsx" },
		{
			code: `<div role="menuitemcheckbox" aria-checked="true" />`,
			fileName: "file.tsx",
		},
		{
			code: `<div role="menuitemradio" aria-checked="false" />`,
			fileName: "file.tsx",
		},
		{
			code: `<div role="option" aria-selected="true" />`,
			fileName: "file.tsx",
		},
		{ code: `<div role="radio" aria-checked="true" />`, fileName: "file.tsx" },
		{
			code: `<div role="scrollbar" aria-controls="content" aria-valuenow="50" aria-valuemax="100" aria-valuemin="0" />`,
			fileName: "file.tsx",
		},
		{
			code: `<div role="slider" aria-valuenow="5" aria-valuemax="10" aria-valuemin="0" />`,
			fileName: "file.tsx",
		},
		{
			code: `<div role="spinbutton" aria-valuenow="1" aria-valuemax="100" aria-valuemin="1" />`,
			fileName: "file.tsx",
		},
		{
			code: `<button role="switch" aria-checked="false" />`,
			fileName: "file.tsx",
		},
		{ code: `<div role="button" />`, fileName: "file.tsx" },
		{ code: `<div role="link" />`, fileName: "file.tsx" },
		{ code: `<div role="gridcell" />`, fileName: "file.tsx" },
		{ code: `<div role="searchbox" />`, fileName: "file.tsx" },
		{ code: `<div role="separator" />`, fileName: "file.tsx" },
		{ code: `<div role="tab" />`, fileName: "file.tsx" },
		{ code: `<div role="tabpanel" />`, fileName: "file.tsx" },
		{ code: `<div role="textbox" />`, fileName: "file.tsx" },
		{ code: `<div role="treeitem" />`, fileName: "file.tsx" },
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<button />`, fileName: "file.tsx" },
	],
});
