import rule from "./anchorValidity.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<a />`,
			fileName: "file.tsx",
			snapshot: `<a />
~~~~~
Anchor element is missing an href attribute.`,
		},
		{
			code: `<a href="#" />`,
			fileName: "file.tsx",
			snapshot: `<a href="#" />
~~~~~~~~~~~~~~
Anchor has an invalid href value '#'.`,
		},
		{
			code: `<a href="javascript:void(0)" />`,
			fileName: "file.tsx",
			snapshot: `<a href="javascript:void(0)" />
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Anchor has an invalid href value 'javascript:void(0)'.`,
		},
		{
			code: `<a onClick={() => {}} />`,
			fileName: "file.tsx",
			snapshot: `<a onClick={() => {}} />
~~~~~~~~~~~~~~~~~~~~~~~~
Anchor with onClick handler should be a button.`,
		},
		{
			code: `<a href="#" onClick={() => {}} />`,
			fileName: "file.tsx",
			snapshot: `<a href="#" onClick={() => {}} />
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Anchor with onClick handler should be a button.`,
		},
	],
	valid: [
		{ code: `<a href="https://example.com" />`, fileName: "file.tsx" },
		{ code: `<a href="/path" />`, fileName: "file.tsx" },
		{ code: `<a href="#section" />`, fileName: "file.tsx" },
		{ code: `<a href="page.html" />`, fileName: "file.tsx" },
		{
			code: `<a href="https://example.com" onClick={() => {}} />`,
			fileName: "file.tsx",
		},
		{ code: `<a href={someVariable} />`, fileName: "file.tsx" },
	],
});
