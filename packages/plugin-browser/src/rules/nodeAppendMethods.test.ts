import rule from "./nodeAppendMethods.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
declare const element: HTMLElement;
element.appendChild(child);
`,
			snapshot: `
declare const element: HTMLElement;
element.appendChild(child);
        ~~~~~~~~~~~
        Prefer \`append()\` over \`appendChild()\`.
`,
		},
		{
			code: `
declare const node: HTMLElement;
node.insertBefore(child, null);
`,
			snapshot: `
declare const node: HTMLElement;
node.insertBefore(child, null);
     ~~~~~~~~~~~~
     Prefer \`append()\` over \`insertBefore()\`.
`,
		},
		{
			code: `
declare const node: HTMLElement;
node.insertBefore(child, parent.firstChild);
`,
			snapshot: `
declare const node: HTMLElement;
node.insertBefore(child, parent.firstChild);
     ~~~~~~~~~~~~
     Prefer \`prepend()\` over \`insertBefore()\`.
`,
		},
		{
			code: `
document.body.appendChild(element);
`,
			snapshot: `
document.body.appendChild(element);
              ~~~~~~~~~~~
              Prefer \`append()\` over \`appendChild()\`.
`,
		},
	],
	valid: [
		`
declare const element: HTMLElement;
element.append(child);
`,
		`
declare const node: HTMLElement;
node.prepend(newNode);
`,
		`
declare const element: HTMLElement;
element.append(child1, child2);
`,
		`
declare const element: HTMLElement;
element.append("text");
`,
		`
declare const node: HTMLElement;
node.append(child);
`,
		`
declare const other: { appendChild: () => void };
other.appendChild();
`,
		`
declare const element: { method: () => void };
element.method();
`,
		`
declare const node: HTMLElement;
node.insertBefore(child, referenceNode);
`,
	],
});
