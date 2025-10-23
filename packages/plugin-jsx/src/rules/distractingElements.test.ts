import rule from "./distractingElements.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<marquee />`,
			fileName: "file.tsx",
			snapshot: `<marquee />
~~~~~~~
The <marquee> element is distracting and deprecated.
`,
		},
		{
			code: `<blink />`,
			fileName: "file.tsx",
			snapshot: `<blink />
~~~~~
The <blink> element is distracting and deprecated.
`,
		},
		{
			code: `<marquee>Hello</marquee>`,
			fileName: "file.tsx",
			snapshot: `<marquee>Hello</marquee>
~~~~~~~
The <marquee> element is distracting and deprecated.
`,
		},
		{
			code: `<BLINK>Alert!</BLINK>`,
			fileName: "file.tsx",
			snapshot: `<BLINK>Alert!</BLINK>
~~~~~
The <blink> element is distracting and deprecated.
`,
		},
	],
	valid: [
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<span>Text</span>`, fileName: "file.tsx" },
		{ code: `<button>Click me</button>`, fileName: "file.tsx" },
		{
			code: `<div className="marquee-style">Animated</div>`,
			fileName: "file.tsx",
		},
	],
});
