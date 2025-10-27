import rule from "./roleTags.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<div role="button" />`,
			fileName: "file.tsx",
			snapshot: `<div role="button" />
     ~~~~~~~~~~~~~
     Use <button> instead of <div> with role='button'.`,
		},
		{
			code: `<div role="img" />`,
			fileName: "file.tsx",
			snapshot: `<div role="img" />
     ~~~~~~~~~~
     Use <img> instead of <div> with role='img'.`,
		},
		{
			code: `<span role="link" />`,
			fileName: "file.tsx",
			snapshot: `<span role="link" />
      ~~~~~~~~~~~
      Use <a> instead of <span> with role='link'.`,
		},
		{
			code: `<div role="navigation" />`,
			fileName: "file.tsx",
			snapshot: `<div role="navigation" />
     ~~~~~~~~~~~~~~~~~
     Use <nav> instead of <div> with role='navigation'.`,
		},
	],
	valid: [
		{ code: `<button />`, fileName: "file.tsx" },
		{ code: `<img />`, fileName: "file.tsx" },
		{ code: `<a href="#" />`, fileName: "file.tsx" },
		{ code: `<nav />`, fileName: "file.tsx" },
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<div role="presentation" />`, fileName: "file.tsx" },
	],
});
