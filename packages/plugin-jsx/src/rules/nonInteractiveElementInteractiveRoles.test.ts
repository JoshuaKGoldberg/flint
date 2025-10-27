import rule from "./nonInteractiveElementInteractiveRoles.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `<h1 role="button" />`,
			fileName: "file.tsx",
			snapshot: `<h1 role="button" />
    ~~~~~~~~~~~~~
    Non-interactive element <h1> cannot have interactive role 'button'.`,
		},
		{
			code: `<div role="link" />`,
			fileName: "file.tsx",
			snapshot: `<div role="link" />
     ~~~~~~~~~~~
     Non-interactive element <div> cannot have interactive role 'link'.`,
		},
		{
			code: `<img role="checkbox" />`,
			fileName: "file.tsx",
			snapshot: `<img role="checkbox" />
     ~~~~~~~~~~~~~~~
     Non-interactive element <img> cannot have interactive role 'checkbox'.`,
		},
	],
	valid: [
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<div role="presentation" />`, fileName: "file.tsx" },
		{ code: `<ul role="menu" />`, fileName: "file.tsx" },
		{ code: `<li role="menuitem" />`, fileName: "file.tsx" },
		{ code: `<table role="grid" />`, fileName: "file.tsx" },
		{ code: `<button role="button" />`, fileName: "file.tsx" },
	],
});
