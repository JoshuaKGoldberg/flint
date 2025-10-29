import rule from "./childrenProps.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div children="Hello" />
`,
			fileName: "file.tsx",
			snapshot: `
<div children="Hello" />
     ~~~~~~~~~~~~~~~~
     Prefer providing children as content between opening and closing tags, not as a \`children\` prop.
`,
		},
		{
			code: `
<Component children={<span>Test</span>} />
`,
			fileName: "file.tsx",
			snapshot: `
<Component children={<span>Test</span>} />
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           Prefer providing children as content between opening and closing tags, not as a \`children\` prop.
`,
		},
		{
			code: `
<button children={["Click me"]} />
`,
			fileName: "file.tsx",
			snapshot: `
<button children={["Click me"]} />
        ~~~~~~~~~~~~~~~~~~~~~~~
        Prefer providing children as content between opening and closing tags, not as a \`children\` prop.
`,
		},
		{
			code: `
<div children={value} />
`,
			fileName: "file.tsx",
			snapshot: `
<div children={value} />
     ~~~~~~~~~~~~~~~~
     Prefer providing children as content between opening and closing tags, not as a \`children\` prop.
`,
		},
	],
	valid: [
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<div>Hello</div>`, fileName: "file.tsx" },
		{ code: `<Component><span>Test</span></Component>`, fileName: "file.tsx" },
		{ code: `<button>Click me</button>`, fileName: "file.tsx" },
		{ code: `<div>{value}</div>`, fileName: "file.tsx" },
	],
});
