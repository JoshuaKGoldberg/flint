import { expect } from "vitest";

import rule from "./nodeRemoveMethods.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
declare const parentNode: HTMLElement;
declare const childNode: HTMLElement;
parentNode.removeChild(childNode);
`,
			output: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					declare const parentNode: HTMLElement;
					declare const childNode: HTMLElement;
					childNode.remove();
					"
				`);
			},
			snapshot: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					declare const parentNode: HTMLElement;
					declare const childNode: HTMLElement;
					parentNode.removeChild(childNode);
					           ~~~~~~~~~~~
					           Prefer the modern \`childNode.remove()\` over \`parentNode.removeChild(childNode)\`.
					"
				`);
			},
		},
		{
			code: `
declare const element: HTMLElement;
element.parentNode.removeChild(element);
`,
			output: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					declare const element: HTMLElement;
					element.remove();
					"
				`);
			},
			snapshot: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					declare const element: HTMLElement;
					element.parentNode.removeChild(element);
					                   ~~~~~~~~~~~
					                   Prefer the modern \`element.remove()\` over \`element.parentNode.removeChild(element)\`.
					"
				`);
			},
		},
		{
			code: `
declare const node: HTMLElement;
node.parentElement.removeChild(node);
`,
			output: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					declare const node: HTMLElement;
					node.remove();
					"
				`);
			},
			snapshot: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					declare const node: HTMLElement;
					node.parentElement.removeChild(node);
					                   ~~~~~~~~~~~
					                   Prefer the modern \`node.remove()\` over \`node.parentElement.removeChild(node)\`.
					"
				`);
			},
		},
		{
			code: `
document.body.removeChild(footer);
`,
			output: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					footer.remove();
					"
				`);
			},
			snapshot: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					document.body.removeChild(footer);
					              ~~~~~~~~~~~
					              Prefer the modern \`footer.remove()\` over \`document.body.removeChild(footer)\`.
					"
				`);
			},
		},
	],
	valid: [
		`
declare const parentNode: { removeChild: (child: HTMLElement): void };
declare const childNode: HTMLElement;
parentNode.removeChild(childNode);
`,
		`
declare const element: HTMLElement;
element.remove();
`,
		`
declare const node: HTMLElement;
node.remove();
`,
		`
declare const child: HTMLElement;
child.parentNode.appendChild(child);
`,
		`
declare const parent: HTMLElement;
parent.replaceChild(newChild, oldChild);
`,
		`
declare const other: HTMLElement;
other.removeChild();
`,
		`
declare const node: HTMLElement;
declare function removeChild(child: HTMLElement): void;
removeChild(node);
`,
	],
});
