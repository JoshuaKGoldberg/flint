import rule from "./autocomplete.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<input type="text" autocomplete="foo" />
`,
			fileName: "file.tsx",
			snapshot: `
<input type="text" autocomplete="foo" />
                   ~~~~~~~~~~~~
                   \`foo\` is not a valid value for autocomplete.
`,
		},
		{
			code: `
<input type="email" autocomplete="invalid" />
`,
			fileName: "file.tsx",
			snapshot: `
<input type="email" autocomplete="invalid" />
                    ~~~~~~~~~~~~
                    \`invalid\` is not a valid value for autocomplete.
`,
		},
		{
			code: `
<input type="text" autocomplete="name invalid" />
`,
			fileName: "file.tsx",
			snapshot: `
<input type="text" autocomplete="name invalid" />
                   ~~~~~~~~~~~~
                   \`name invalid\` is not a valid value for autocomplete.
`,
		},
		{
			code: `
<input type="text" autocomplete="home url" />
`,
			fileName: "file.tsx",
			snapshot: `
<input type="text" autocomplete="home url" />
                   ~~~~~~~~~~~~
                   \`home url\` is not a valid value for autocomplete.
`,
		},
		{
			code: `
<input autocomplete="incorrect" />
`,
			fileName: "file.tsx",
			snapshot: `
<input autocomplete="incorrect" />
       ~~~~~~~~~~~~
       \`incorrect\` is not a valid value for autocomplete.
`,
		},
	],
	valid: [
		{ code: `<input type="text" />`, fileName: "file.tsx" },
		{ code: `<input type="text" autocomplete="name" />`, fileName: "file.tsx" },
		{
			code: `<input type="text" autocomplete="email" />`,
			fileName: "file.tsx",
		},
		{ code: `<input type="text" autocomplete="off" />`, fileName: "file.tsx" },
		{ code: `<input type="text" autocomplete="on" />`, fileName: "file.tsx" },
		{
			code: `<input type="text" autocomplete="username" />`,
			fileName: "file.tsx",
		},
		{
			code: `<input type="password" autocomplete="current-password" />`,
			fileName: "file.tsx",
		},
		{
			code: `<input type="password" autocomplete="new-password" />`,
			fileName: "file.tsx",
		},
		{ code: `<input type="tel" autocomplete="tel" />`, fileName: "file.tsx" },
		{ code: `<input type="url" autocomplete="url" />`, fileName: "file.tsx" },
		{
			code: `<input type="text" autocomplete="billing street-address" />`,
			fileName: "file.tsx",
		},
		{
			code: `<input type="text" autocomplete="shipping postal-code" />`,
			fileName: "file.tsx",
		},
		{
			code: `<input type="text" autocomplete="billing country" />`,
			fileName: "file.tsx",
		},
		{ code: `<input type="text" autocomplete />`, fileName: "file.tsx" },
		{
			code: `<input type="text" autocomplete={otherValue} />`,
			fileName: "file.tsx",
		},
		{
			code: `<input type="text" autocomplete={otherValue || "name"} />`,
			fileName: "file.tsx",
		},
		{ code: `<div autocomplete="invalid" />`, fileName: "file.tsx" },
		{ code: `<Foo autocomplete="bar" />`, fileName: "file.tsx" },
		{ code: `<button type="submit" />`, fileName: "file.tsx" },
	],
});
