import rule from "./duplicateProps.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div id="first" id="second">Content</div>
`,
			fileName: "file.tsx",
			snapshot: `
<div id="first" id="second">Content</div>
                ~~
                Duplicate prop \`id\` found in JSX element. The last occurrence will override earlier ones.
`,
		},
		{
			code: `
<button className="btn" onClick={handleClick} className="btn-primary">
    Click me
</button>
`,
			fileName: "file.tsx",
			snapshot: `
<button className="btn" onClick={handleClick} className="btn-primary">
                                              ~~~~~~~~~
                                              Duplicate prop \`className\` found in JSX element. The last occurrence will override earlier ones.
    Click me
</button>
`,
		},
		{
			code: `
<input type="text" name="field" type="email" />
`,
			fileName: "file.tsx",
			snapshot: `
<input type="text" name="field" type="email" />
                                ~~~~
                                Duplicate prop \`type\` found in JSX element. The last occurrence will override earlier ones.
`,
		},
		{
			code: `
<Component
    value="first"
    disabled
    value="second"
    onClick={handler}
    value="third"
/>
`,
			fileName: "file.tsx",
			snapshot: `
<Component
    value="first"
    disabled
    value="second"
    ~~~~~
    Duplicate prop \`value\` found in JSX element. The last occurrence will override earlier ones.
    onClick={handler}
    value="third"
    ~~~~~
    Duplicate prop \`value\` found in JSX element. The last occurrence will override earlier ones.
/>
`,
		},
	],
	valid: [
		{ code: `<div id="unique">Content</div>`, fileName: "file.tsx" },
		{
			code: `<button className="btn" onClick={handleClick}>Click</button>`,
			fileName: "file.tsx",
		},
		{
			code: `<input type="text" name="field" value="test" />`,
			fileName: "file.tsx",
		},
		{ code: `<Component {...props} />`, fileName: "file.tsx" },
		{
			code: `<Element prop1="a" prop2="b" prop3="c" />`,
			fileName: "file.tsx",
		},
	],
});
