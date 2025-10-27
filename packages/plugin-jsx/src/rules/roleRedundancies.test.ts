import rule from "./roleRedundancies.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<button role="button" />`,
			fileName: "file.tsx",
			snapshot: `<button role="button" />
        ~~~~~~~~~~~~~
        Redundant role 'button' on <button>. This element already has an implicit role.`,
		},
		{
			code: `<img role="img" src="foo.jpg" />`,
			fileName: "file.tsx",
			snapshot: `<img role="img" src="foo.jpg" />
     ~~~~~~~~~~
     Redundant role 'img' on <img>. This element already has an implicit role.`,
		},
		{
			code: `<nav role="navigation" />`,
			fileName: "file.tsx",
			snapshot: `<nav role="navigation" />
     ~~~~~~~~~~~~~~~~~
     Redundant role 'navigation' on <nav>. This element already has an implicit role.`,
		},
		{
			code: `<main role="main" />`,
			fileName: "file.tsx",
			snapshot: `<main role="main" />
      ~~~~~~~~~~~
      Redundant role 'main' on <main>. This element already has an implicit role.`,
		},
	],
	valid: [
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<button role="presentation" />`, fileName: "file.tsx" },
		{ code: `<div role="button" />`, fileName: "file.tsx" },
		{ code: `<img src="foo.jpg" />`, fileName: "file.tsx" },
		{ code: `<nav />`, fileName: "file.tsx" },
		{ code: `<button />`, fileName: "file.tsx" },
	],
});
