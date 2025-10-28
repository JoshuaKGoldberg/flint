import rule from "./labelAssociatedControls.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<label />
`,
			fileName: "file.tsx",
			snapshot: `
<label />
 ~~~~~
 This <label> element is missing an associated control element.
`,
		},
		{
			code: `
<label>Name</label>
`,
			fileName: "file.tsx",
			snapshot: `
<label>Name</label>
 ~~~~~
 This <label> element is missing an associated control element.
`,
		},
		{
			code: `
<label><span>Name</span></label>
`,
			fileName: "file.tsx",
			snapshot: `
<label><span>Name</span></label>
 ~~~~~
 This <label> element is missing an associated control element.
`,
		},
		{
			code: `
<label htmlFor="" />
`,
			fileName: "file.tsx",
			snapshot: `
<label htmlFor="" />
 ~~~~~
 This <label> element is missing an associated control element.
`,
		},
	],
	valid: [
		{ code: `<label htmlFor="name">Name</label>`, fileName: "file.tsx" },
		{ code: `<label htmlFor="name" />`, fileName: "file.tsx" },
		{ code: `<label htmlFor={nameId}>Name</label>`, fileName: "file.tsx" },
		{
			code: `<label>Name <input type="text" /></label>`,
			fileName: "file.tsx",
		},
		{ code: `<label><input type="text" /></label>`, fileName: "file.tsx" },
		{ code: `<label><select></select></label>`, fileName: "file.tsx" },
		{ code: `<label><textarea></textarea></label>`, fileName: "file.tsx" },
		{
			code: `<label><div><input type="text" /></div></label>`,
			fileName: "file.tsx",
		},
		{ code: `<label><meter value={0.5} /></label>`, fileName: "file.tsx" },
		{ code: `<label><output>Result</output></label>`, fileName: "file.tsx" },
		{
			code: `<label><progress value={50} max={100} /></label>`,
			fileName: "file.tsx",
		},
		{ code: `<div>Not a label</div>`, fileName: "file.tsx" },
	],
});
