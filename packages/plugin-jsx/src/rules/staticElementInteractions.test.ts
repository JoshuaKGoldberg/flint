import rule from "./staticElementInteractions.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<div onClick={() => {}} />`,
			fileName: "file.tsx",
			snapshot: `<div onClick={() => {}} />
 ~~~
 Static elements with event handlers must have a role attribute.`,
		},
		{
			code: `<span onKeyDown={handler} />`,
			fileName: "file.tsx",
			snapshot: `<span onKeyDown={handler} />
 ~~~~
 Static elements with event handlers must have a role attribute.`,
		},
		{
			code: `<section onMouseDown={() => {}} />`,
			fileName: "file.tsx",
			snapshot: `<section onMouseDown={() => {}} />
 ~~~~~~~
 Static elements with event handlers must have a role attribute.`,
		},
	],
	valid: [
		{ code: `<div onClick={() => {}} role="button" />`, fileName: "file.tsx" },
		{ code: `<span onKeyDown={handler} role="link" />`, fileName: "file.tsx" },
		{ code: `<button onClick={() => {}} />`, fileName: "file.tsx" },
		{ code: `<input onClick={() => {}} />`, fileName: "file.tsx" },
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<a onClick={() => {}} />`, fileName: "file.tsx" },
	],
});
