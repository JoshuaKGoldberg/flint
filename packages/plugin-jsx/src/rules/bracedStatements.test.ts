import rule from "./bracedStatements.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div>{"Hello"}</div>
`,
			fileName: "file.tsx",
			snapshot: `
<div>{"Hello"}</div>
     ~~~~~~~~~
     Prefer removing unnecessary curly braces around string literals.
`,
		},
		{
			code: `
<div>{<span>Content</span>}</div>
`,
			fileName: "file.tsx",
			snapshot: `
<div>{<span>Content</span>}</div>
     ~~~~~~~~~~~~~~~~~~~~~~
     Prefer removing unnecessary curly braces around JSX elements.
`,
		},
		{
			code: `
<div>{<Component />}</div>
`,
			fileName: "file.tsx",
			snapshot: `
<div>{<Component />}</div>
     ~~~~~~~~~~~~~~~
     Prefer removing unnecessary curly braces around JSX elements.
`,
		},
		{
			code: `
<Component>{<></>}</Component>
`,
			fileName: "file.tsx",
			snapshot: `
<Component>{<></>}</Component>
           ~~~~~~~
           Prefer removing unnecessary curly braces around JSX elements.
`,
		},
	],
	valid: [
		{ code: `<div>Hello</div>`, fileName: "file.tsx" },
		{ code: `<div><span>Content</span></div>`, fileName: "file.tsx" },
		{ code: `<div>{variable}</div>`, fileName: "file.tsx" },
		{ code: `<div>{someFunction()}</div>`, fileName: "file.tsx" },
		{ code: `<div>{1 + 2}</div>`, fileName: "file.tsx" },
		{ code: `<Component attribute={"value"} />`, fileName: "file.tsx" },
	],
});
