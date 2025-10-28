import rule from "./interactiveElementNonInteractiveRoles.js";
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
<a role="presentation" />
`,
			fileName: "file.tsx",
			snapshot: `
<a role="presentation" />
   ~~~~~~~~~~~~~~~~~~~
   Interactive element <a> should not have the non-interactive role \`'presentation'\`.
`,
		},
		{
			code: `
<input role="none" />
`,
			fileName: "file.tsx",
			snapshot: `
<input role="none" />
       ~~~~~~~~~~~
       Interactive element <input> should not have the non-interactive role \`'none'\`.
`,
		},
		{
			code: `
<select role="heading" />
`,
			fileName: "file.tsx",
			snapshot: `
<select role="heading" />
        ~~~~~~~~~~~~~~
        Interactive element <select> should not have the non-interactive role \`'heading'\`.
`,
		},
		{
			code: `
<textarea role="img" />
`,
			fileName: "file.tsx",
			snapshot: `
<textarea role="img" />
          ~~~~~~~~~~
          Interactive element <textarea> should not have the non-interactive role \`'img'\`.
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
