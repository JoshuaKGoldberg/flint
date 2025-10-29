import { ruleTester } from "./ruleTester.js";
import rule from "./unnecessaryFragments.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const element = <><div>Hello</div></>;
`,
			fileName: "file.tsx",
			snapshot: `
const element = <><div>Hello</div></>;
                ~~~~~~~~~~~~~~~~~~~~~
                Unnecessary fragment wrapping a single child.
`,
		},
		{
			code: `
const element = <>Hello</>;
`,
			fileName: "file.tsx",
			snapshot: `
const element = <>Hello</>;
                ~~~~~~~~~~
                Unnecessary fragment wrapping a single child.
`,
		},
		{
			code: `
const element = <></>;
`,
			fileName: "file.tsx",
			snapshot: `
const element = <></>;
                ~~~~~
                Unnecessary fragment wrapping no children.
`,
		},
		{
			code: `
const element = <Fragment><div>Hello</div></Fragment>;
`,
			fileName: "file.tsx",
			snapshot: `
const element = <Fragment><div>Hello</div></Fragment>;
                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                Unnecessary fragment wrapping a single child.
`,
		},
		{
			code: `
const element = <Fragment></Fragment>;
`,
			fileName: "file.tsx",
			snapshot: `
const element = <Fragment></Fragment>;
                ~~~~~~~~~~~~~~~~~~~~~
                Unnecessary fragment wrapping no children.
`,
		},
		{
			code: `
const element = <>
    <div>Hello</div>
</>;
`,
			fileName: "file.tsx",
			snapshot: `
const element = <>
                ~~
                Unnecessary fragment wrapping a single child.
    <div>Hello</div>
    ~~~~~~~~~~~~~~~~
</>;
~~~
`,
		},
		{
			code: `
return (
    <>
        <Component />
    </>
);
`,
			fileName: "file.tsx",
			snapshot: `
return (
    <>
    ~~
    Unnecessary fragment wrapping a single child.
        <Component />
        ~~~~~~~~~~~~~
    </>
    ~~~
);
`,
		},
		{
			code: `
const element = <Fragment>
    Text content
</Fragment>;
`,
			fileName: "file.tsx",
			snapshot: `
const element = <Fragment>
                ~~~~~~~~~~
                Unnecessary fragment wrapping a single child.
    Text content
    ~~~~~~~~~~~~
</Fragment>;
~~~~~~~~~~~
`,
		},
	],
	valid: [
		{
			code: `const element = <><div>First</div><div>Second</div></>;`,
			fileName: "file.tsx",
		},
		{
			code: `const element = <Fragment><div>First</div><div>Second</div></Fragment>;`,
			fileName: "file.tsx",
		},
		{
			code: `const element = <Fragment key="item"><div>Hello</div></Fragment>;`,
			fileName: "file.tsx",
		},
		{
			code: `const element = <><div>A</div><div>B</div><div>C</div></>;`,
			fileName: "file.tsx",
		},
		{ code: `const element = <div>Hello</div>;`, fileName: "file.tsx" },
		{
			code: `
return (
    <>
        <div>First</div>
        <div>Second</div>
    </>
);
`,
			fileName: "file.tsx",
		},
		{
			code: `const element = <Fragment key={item.id}><span>{item.text}</span></Fragment>;`,
			fileName: "file.tsx",
		},
		{
			code: `
const element = <>
    <div>First</div>
    Text between
    <div>Second</div>
</>;
`,
			fileName: "file.tsx",
		},
	],
});
