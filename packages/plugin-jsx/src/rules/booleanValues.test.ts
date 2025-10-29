import rule from "./booleanValues.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<button disabled={true}>Click me</button>
`,
			fileName: "file.tsx",
			snapshot: `
<button disabled={true}>Click me</button>
        ~~~~~~~~~~~~~~~
        Prefer shorthand boolean attribute \`disabled\` over explicit \`disabled={true}\`.
`,
		},
		{
			code: `
<input type="text" required={true} />
`,
			fileName: "file.tsx",
			snapshot: `
<input type="text" required={true} />
                   ~~~~~~~~~~~~~~~
                   Prefer shorthand boolean attribute \`required\` over explicit \`required={true}\`.
`,
		},
		{
			code: `
<Component isActive={true} />
`,
			fileName: "file.tsx",
			snapshot: `
<Component isActive={true} />
           ~~~~~~~~~~~~~~~
           Prefer shorthand boolean attribute \`isActive\` over explicit \`isActive={true}\`.
`,
		},
		{
			code: `
<div hidden={true} aria-hidden={true}></div>
`,
			fileName: "file.tsx",
			snapshot: `
<div hidden={true} aria-hidden={true}></div>
     ~~~~~~~~~~~~~
     Prefer shorthand boolean attribute \`hidden\` over explicit \`hidden={true}\`.
                   ~~~~~~~~~~~~~~~~~~
                   Prefer shorthand boolean attribute \`aria-hidden\` over explicit \`aria-hidden={true}\`.
`,
		},
	],
	valid: [
		{ code: `<button disabled>Click me</button>`, fileName: "file.tsx" },
		{ code: `<input type="text" required />`, fileName: "file.tsx" },
		{ code: `<Component isActive />`, fileName: "file.tsx" },
		{
			code: `<button disabled={false}>Click me</button>`,
			fileName: "file.tsx",
		},
		{ code: `<input type="text" required={false} />`, fileName: "file.tsx" },
		{
			code: `<Component isActive={someCondition} />`,
			fileName: "file.tsx",
		},
		{ code: `<button>Click me</button>`, fileName: "file.tsx" },
		{ code: `<div className="test" />`, fileName: "file.tsx" },
	],
});
