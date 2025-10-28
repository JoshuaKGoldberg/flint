import rule from "./ariaRoleValidity.js";
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
     Invalid ARIA role 'datepicker'. Use a valid, non-abstract role.
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
     Invalid ARIA role 'range'. Use a valid, non-abstract role.
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
     Invalid ARIA role '(empty)'. Use a valid, non-abstract role.
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
      Invalid ARIA role 'invalid'. Use a valid, non-abstract role.
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
	],
});
