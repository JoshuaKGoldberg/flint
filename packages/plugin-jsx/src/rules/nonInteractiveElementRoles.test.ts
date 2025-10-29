import rule from "./nonInteractiveElementRoles.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<h1 role="button" />
`,
			fileName: "file.tsx",
			snapshot: `
<h1 role="button" />
    ~~~~~~~~~~~~~
    Non-interactive element <h1> should not have the interactive role \`'button'\`.
`,
		},
		{
			code: `
<div role="link" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="link" />
     ~~~~~~~~~~~
     Non-interactive element <div> should not have the interactive role \`'link'\`.
`,
		},
		{
			code: `
<img role="checkbox" />
`,
			fileName: "file.tsx",
			snapshot: `
<img role="checkbox" />
     ~~~~~~~~~~~~~~~
     Non-interactive element <img> should not have the interactive role \`'checkbox'\`.
`,
		},
	],
	valid: [
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<div role="presentation" />`, fileName: "file.tsx" },
		{ code: `<ul role="menu" />`, fileName: "file.tsx" },
		{ code: `<li role="menuitem" />`, fileName: "file.tsx" },
		{ code: `<table role="grid" />`, fileName: "file.tsx" },
		{ code: `<button role="button" />`, fileName: "file.tsx" },
		{ code: `<CustomElement role="button" />`, fileName: "file.tsx" },
	],
});
