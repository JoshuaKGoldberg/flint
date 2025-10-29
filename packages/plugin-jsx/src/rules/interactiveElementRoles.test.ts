import rule from "./interactiveElementRoles.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<button role="article" />
`,
			fileName: "file.tsx",
			snapshot: `
<button role="article" />
        ~~~~~~~~~~~~~~
        Interactive element <button> should not have the non-interactive role \`'article'\`.
`,
		},
		{
			code: `
<a role="img" />
`,
			fileName: "file.tsx",
			snapshot: `
<a role="img" />
   ~~~~~~~~~~
   Interactive element <a> should not have the non-interactive role \`'img'\`.
`,
		},
		{
			code: `
<input role="navigation" />
`,
			fileName: "file.tsx",
			snapshot: `
<input role="navigation" />
       ~~~~~~~~~~~~~~~~~
       Interactive element <input> should not have the non-interactive role \`'navigation'\`.
`,
		},
		{
			code: `
<textarea role="tooltip" />
`,
			fileName: "file.tsx",
			snapshot: `
<textarea role="tooltip" />
          ~~~~~~~~~~~~~~
          Interactive element <textarea> should not have the non-interactive role \`'tooltip'\`.
`,
		},
		{
			code: `
<select role="main" />
`,
			fileName: "file.tsx",
			snapshot: `
<select role="main" />
        ~~~~~~~~~~~
        Interactive element <select> should not have the non-interactive role \`'main'\`.
`,
		},
		{
			code: `
<audio role="status" />
`,
			fileName: "file.tsx",
			snapshot: `
<audio role="status" />
       ~~~~~~~~~~~~~
       Interactive element <audio> should not have the non-interactive role \`'status'\`.
`,
		},
		{
			code: `
<video role="presentation" />
`,
			fileName: "file.tsx",
			snapshot: `
<video role="presentation" />
       ~~~~~~~~~~~~~~~~~~~
       Interactive element <video> should not have the non-interactive role \`'presentation'\`.
`,
		},
		{
			code: `
<details role="none" />
`,
			fileName: "file.tsx",
			snapshot: `
<details role="none" />
         ~~~~~~~~~~~
         Interactive element <details> should not have the non-interactive role \`'none'\`.
`,
		},
	],
	valid: [
		{ code: `<button />`, fileName: "file.tsx" },
		{ code: `<button role="button" />`, fileName: "file.tsx" },
		{ code: `<a role="link" />`, fileName: "file.tsx" },
		{ code: `<input role="textbox" />`, fileName: "file.tsx" },
		{ code: `<div role="article" />`, fileName: "file.tsx" },
		{ code: `<CustomElement role="article" />`, fileName: "file.tsx" },
	],
});
