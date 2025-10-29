import { ruleTester } from "./ruleTester.js";
import rule from "./svgTitles.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<svg />
`,
			fileName: "file.tsx",
			snapshot: `
<svg />
 ~~~
 This <svg> element is missing a <title> child element.
`,
		},
		{
			code: `
<svg viewBox="0 0 100 100" />
`,
			fileName: "file.tsx",
			snapshot: `
<svg viewBox="0 0 100 100" />
 ~~~
 This <svg> element is missing a <title> child element.
`,
		},
		{
			code: `
<svg>
    <circle cx="50" cy="50" r="40" />
</svg>`,
			fileName: "file.tsx",
			snapshot: `
<svg>
 ~~~
 This <svg> element is missing a <title> child element.
    <circle cx="50" cy="50" r="40" />
</svg>`,
		},
		{
			code: `
<svg>
    <desc>Description only</desc>
</svg>`,
			fileName: "file.tsx",
			snapshot: `
<svg>
 ~~~
 This <svg> element is missing a <title> child element.
    <desc>Description only</desc>
</svg>`,
		},
		{
			code: `
<svg aria-label="" />
`,
			fileName: "file.tsx",
			snapshot: `
<svg aria-label="" />
 ~~~
 This <svg> element is missing a <title> child element.
`,
		},
		{
			code: `
<svg aria-label={""} />
`,
			fileName: "file.tsx",
			snapshot: `
<svg aria-label={""} />
 ~~~
 This <svg> element is missing a <title> child element.
`,
		},
		{
			code: `
<svg aria-label={\`\`} />
`,
			fileName: "file.tsx",
			snapshot: `
<svg aria-label={\`\`} />
 ~~~
 This <svg> element is missing a <title> child element.
`,
		},
		{
			code: `
<svg aria-label={undefined} />
`,
			fileName: "file.tsx",
			snapshot: `
<svg aria-label={undefined} />
 ~~~
 This <svg> element is missing a <title> child element.
`,
		},
		{
			code: `
<svg aria-labelledby="" />
`,
			fileName: "file.tsx",
			snapshot: `
<svg aria-labelledby="" />
 ~~~
 This <svg> element is missing a <title> child element.
`,
		},
	],
	valid: [
		{
			code: `
<svg>
    <title>Accessible title</title>
</svg>`,
			fileName: "file.tsx",
		},
		{
			code: `
<svg>
    <title>Circle</title>
    <circle cx="50" cy="50" r="40" />
</svg>`,
			fileName: "file.tsx",
		},
		{
			code: `
<svg aria-label="Accessible label" />
`,
			fileName: "file.tsx",
		},
		{
			code: `
<svg aria-labelledby="title-id" />
`,
			fileName: "file.tsx",
		},
		{
			code: `
<svg aria-labelledby="title-id">
    <circle cx="50" cy="50" r="40" />
</svg>
`,
			fileName: "file.tsx",
		},
		{ code: `<div>Not an svg element</div>`, fileName: "file.tsx" },
	],
});
