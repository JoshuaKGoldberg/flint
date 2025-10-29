import rule from "./buttonTypes.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<button>Click me</button>
`,
			fileName: "file.tsx",
			snapshot: `
<button>Click me</button>
 ~~~~~~
 It is generally preferable to add an explicit \`type\` attribute to buttons.
`,
		},
		{
			code: `
<button />
`,
			fileName: "file.tsx",
			snapshot: `
<button />
 ~~~~~~
 It is generally preferable to add an explicit \`type\` attribute to buttons.
`,
		},
		{
			code: `
<button onClick={handleClick}>Submit</button>
`,
			fileName: "file.tsx",
			snapshot: `
<button onClick={handleClick}>Submit</button>
 ~~~~~~
 It is generally preferable to add an explicit \`type\` attribute to buttons.
`,
		},
		{
			code: `
<button type="invalid">Click</button>
`,
			fileName: "file.tsx",
			snapshot: `
<button type="invalid">Click</button>
        ~~~~~~~~~~~~~~
        Button type 'invalid' is invalid. Use 'button', 'submit', or 'reset'.
`,
		},
		{
			code: `
<button type={"wrong"}>Click</button>
`,
			fileName: "file.tsx",
			snapshot: `
<button type={"wrong"}>Click</button>
        ~~~~~~~~~~~~~~
        Button type 'wrong' is invalid. Use 'button', 'submit', or 'reset'.
`,
		},
	],
	valid: [
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<button type="button">Click</button>`, fileName: "file.tsx" },
		{ code: `<button type="submit">Submit</button>`, fileName: "file.tsx" },
		{ code: `<button type="reset">Reset</button>`, fileName: "file.tsx" },
		{ code: `<button type={"button"}>Click</button>`, fileName: "file.tsx" },
		{ code: `<button type="button" />`, fileName: "file.tsx" },
		{ code: `<input type="button" />`, fileName: "file.tsx" },
		{ code: `<a href="#">Link</a>`, fileName: "file.tsx" },
	],
});
