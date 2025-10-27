import rule from "./clickEventKeyEvents.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<div onClick={() => {}} />`,
			fileName: "file.tsx",
			snapshot: `<div onClick={() => {}} />
     ~~~~~~~~~~~~~~~~~~
     \`onClick\` must be accompanied by at least one of: \`onKeyUp\`, \`onKeyDown\`, \`onKeyPress\`.`,
		},
		{
			code: `<span onClick={handler} />`,
			fileName: "file.tsx",
			snapshot: `<span onClick={handler} />
      ~~~~~~~~~~~~~~~~~
      \`onClick\` must be accompanied by at least one of: \`onKeyUp\`, \`onKeyDown\`, \`onKeyPress\`.`,
		},
	],
	valid: [
		{
			code: `<div onClick={() => {}} onKeyDown={handler} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div onClick={() => {}} onKeyUp={handler} />`,
			fileName: "file.tsx",
		},
		{
			code: `<div onClick={() => {}} onKeyPress={handler} />`,
			fileName: "file.tsx",
		},
		{ code: `<button onClick={() => {}} />`, fileName: "file.tsx" },
		{
			code: `<div onClick={() => {}} aria-hidden="true" />`,
			fileName: "file.tsx",
		},
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<input onClick={() => {}} />`, fileName: "file.tsx" },
	],
});
