import rule from "./ariaRoles.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div role="datepicker" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="datepicker" />
     ~~~~~~~~~~~~~~~~~
     Invalid ARIA role 'datepicker'. Use a valid ARIA role.
`,
		},
		{
			code: `
<div role="range" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="range" />
     ~~~~~~~~~~~~
     Invalid ARIA role 'range'. Use a valid ARIA role.
`,
		},
		{
			code: `
<div role="" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="" />
     ~~~~~~~
     Invalid ARIA role '(empty)'. Use a valid ARIA role.
`,
		},
		{
			code: `
<span role="invalid" />
`,
			fileName: "file.tsx",
			snapshot: `
<span role="invalid" />
      ~~~~~~~~~~~~~~
      Invalid ARIA role 'invalid'. Use a valid ARIA role.
`,
		},
		{
			code: `
<div role="custom-role" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="custom-role" />
     ~~~~~~~~~~~~~~~~~~
     Invalid ARIA role 'custom-role'. Use a valid ARIA role.
`,
		},
	],
	valid: [
		{ code: `<div role="button" />`, fileName: "file.tsx" },
		{ code: `<div role="navigation" />`, fileName: "file.tsx" },
		{ code: `<span role="link" />`, fileName: "file.tsx" },
		{ code: `<div role={dynamicRole} />`, fileName: "file.tsx" },
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<button role="button" />`, fileName: "file.tsx" },
		{ code: `<CustomElement role="other" />`, fileName: "file.tsx" },
		{ code: `<div role="alert" />`, fileName: "file.tsx" },
		{ code: `<div role="dialog" />`, fileName: "file.tsx" },
		{ code: `<div role="menu" />`, fileName: "file.tsx" },
		{ code: `<div role="none" />`, fileName: "file.tsx" },
		{ code: `<div role="presentation" />`, fileName: "file.tsx" },
	],
});
