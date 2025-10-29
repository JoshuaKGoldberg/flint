import rule from "./duplicateSpreads.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div {...props1} {...props2} />
`,
			fileName: "file.tsx",
			snapshot: `
<div {...props1} {...props2} />
                 ~~~~~~~~~~~
                 Avoid using multiple spread attributes on the same JSX element.
`,
		},
		{
			code: `
<Component {...props1} {...props2} />
`,
			fileName: "file.tsx",
			snapshot: `
<Component {...props1} {...props2} />
                       ~~~~~~~~~~~
                       Avoid using multiple spread attributes on the same JSX element.
`,
		},
		{
			code: `
<div {...props1} {...props2} {...props3} />
`,
			fileName: "file.tsx",
			snapshot: `
<div {...props1} {...props2} {...props3} />
                 ~~~~~~~~~~~
                 Avoid using multiple spread attributes on the same JSX element.
                             ~~~~~~~~~~~
                             Avoid using multiple spread attributes on the same JSX element.
`,
		},
		{
			code: `
<div {...{ a: 1 }} {...{ b: 2 }} />
`,
			fileName: "file.tsx",
			snapshot: `
<div {...{ a: 1 }} {...{ b: 2 }} />
                   ~~~~~~~~~~~~~
                   Avoid using multiple spread attributes on the same JSX element.
`,
		},
		{
			code: `
<button
    {...defaultProps}
    {...customProps}
    onClick={handleClick}
/>
`,
			fileName: "file.tsx",
			snapshot: `
<button
    {...defaultProps}
    {...customProps}
    ~~~~~~~~~~~~~~~~
    Avoid using multiple spread attributes on the same JSX element.
    onClick={handleClick}
/>
`,
		},
		{
			code: `
<Component
    className="test"
    {...props1}
    {...props2}
/>
`,
			fileName: "file.tsx",
			snapshot: `
<Component
    className="test"
    {...props1}
    {...props2}
    ~~~~~~~~~~~
    Avoid using multiple spread attributes on the same JSX element.
/>
`,
		},
	],
	valid: [
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<div {...props} />`, fileName: "file.tsx" },
		{ code: `<Component {...props} />`, fileName: "file.tsx" },
		{ code: `<div className="test" {...props} />`, fileName: "file.tsx" },
		{ code: `<div {...props} className="test" />`, fileName: "file.tsx" },
		{
			code: `<div {...props} onClick={handleClick} />`,
			fileName: "file.tsx",
		},
		{ code: `<button type="button" disabled />`, fileName: "file.tsx" },
	],
});
