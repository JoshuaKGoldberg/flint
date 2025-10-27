import rule from "./ariaUnsupportedElements.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<meta charset="UTF-8" aria-hidden="false" />
`,
			fileName: "file.tsx",
			snapshot: `
<meta charset="UTF-8" aria-hidden="false" />
 ~~~~
 The \`meta\` element does not support ARIA roles, states, or properties.
`,
		},
		{
			code: `
<script role="application" />
`,
			fileName: "file.tsx",
			snapshot: `
<script role="application" />
 ~~~~~~
 The \`script\` element does not support ARIA roles, states, or properties.
`,
		},
		{
			code: `
<style aria-label="styles" />
`,
			fileName: "file.tsx",
			snapshot: `
<style aria-label="styles" />
 ~~~~~
 The \`style\` element does not support ARIA roles, states, or properties.
`,
		},
		{
			code: `
<html aria-required="true" />
`,
			fileName: "file.tsx",
			snapshot: `
<html aria-required="true" />
 ~~~~
 The \`html\` element does not support ARIA roles, states, or properties.
`,
		},
	],
	valid: [
		{
			code: `<meta charset="UTF-8" />`,
			fileName: "file.tsx",
		},
		{
			code: `<script src="app.js" />`,
			fileName: "file.tsx",
		},
		{
			code: `<style>{css}</style>`,
			fileName: "file.tsx",
		},
		{
			code: `<div role="button" />`,
			fileName: "file.tsx",
		},
		{
			code: `<button aria-label="Click me" />`,
			fileName: "file.tsx",
		},
	],
});
