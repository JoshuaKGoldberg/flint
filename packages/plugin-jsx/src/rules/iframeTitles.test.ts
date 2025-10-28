import rule from "./iframeTitles.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<iframe />
`,
			fileName: "file.tsx",
			snapshot: `
<iframe />
 ~~~~~~
 This <iframe> element is missing a \`title\` prop.
`,
		},
		{
			code: `
<iframe src="https://example.com" />
`,
			fileName: "file.tsx",
			snapshot: `
<iframe src="https://example.com" />
 ~~~~~~
 This <iframe> element is missing a \`title\` prop.
`,
		},
		{
			code: `
<iframe title="" />
`,
			fileName: "file.tsx",
			snapshot: `
<iframe title="" />
 ~~~~~~
 This <iframe> element is missing a \`title\` prop.
`,
		},
		{
			code: `
<iframe title={''} />
`,
			fileName: "file.tsx",
			snapshot: `
<iframe title={''} />
 ~~~~~~
 This <iframe> element is missing a \`title\` prop.
`,
		},
		{
			code: `
<iframe title={\`\`} />
`,
			fileName: "file.tsx",
			snapshot: `
<iframe title={\`\`} />
 ~~~~~~
 This <iframe> element is missing a \`title\` prop.
`,
		},
		{
			code: `
<iframe title={undefined} />
`,
			fileName: "file.tsx",
			snapshot: `
<iframe title={undefined} />
 ~~~~~~
 This <iframe> element is missing a \`title\` prop.
`,
		},
	],
	valid: [
		{
			code: `<iframe title="This is a unique title" />
	`,
			fileName: "file.tsx",
		},
		{
			code: `<iframe title={uniqueTitle} />
	`,
			fileName: "file.tsx",
		},
		{
			code: `<iframe title="Video player" src="video.mp4" />
	`,
			fileName: "file.tsx",
		},
		{ code: `<div>Not an iframe</div>`, fileName: "file.tsx" },
	],
});
