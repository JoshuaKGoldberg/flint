import rule from "./nonInteractiveElementTabIndexes.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<div tabIndex="0" />`,
			fileName: "file.tsx",
			snapshot: `<div tabIndex="0" />
     ~~~~~~~~~~~~
     Non-interactive element <div> should not have a tabIndex of 0.`,
		},
		{
			code: `<div tabIndex={0} />`,
			fileName: "file.tsx",
			snapshot: `<div tabIndex={0} />
     ~~~~~~~~~~~~
     Non-interactive element <div> should not have a tabIndex of 0.`,
		},
		{
			code: `<article tabIndex="0" />`,
			fileName: "file.tsx",
			snapshot: `<article tabIndex="0" />
         ~~~~~~~~~~~~
         Non-interactive element <article> should not have a tabIndex of 0.`,
		},
		{
			code: `<article tabIndex={0} />`,
			fileName: "file.tsx",
			snapshot: `<article tabIndex={0} />
         ~~~~~~~~~~~~
         Non-interactive element <article> should not have a tabIndex of 0.`,
		},
		{
			code: `<div role="article" tabIndex="0" />`,
			fileName: "file.tsx",
			snapshot: `<div role="article" tabIndex="0" />
                    ~~~~~~~~~~~~
                    Non-interactive element <div> should not have a tabIndex of 0.`,
		},
	],
	valid: [
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<button />`, fileName: "file.tsx" },
		{ code: `<button tabIndex="0" />`, fileName: "file.tsx" },
		{ code: `<button tabIndex={0} />`, fileName: "file.tsx" },
		{ code: `<div tabIndex="-1" />`, fileName: "file.tsx" },
		{ code: `<div tabIndex={-1} />`, fileName: "file.tsx" },
		{ code: `<div role="button" tabIndex="0" />`, fileName: "file.tsx" },
		{ code: `<article tabIndex="-1" />`, fileName: "file.tsx" },
	],
});
