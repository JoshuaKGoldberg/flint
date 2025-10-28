import rule from "./nodeRemoveMethods.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
parentNode.removeChild(childNode);
`,
			snapshot: `
parentNode.removeChild(childNode);
           ~~~~~~~~~~~
           Prefer the modern \`childNode.remove()\` over \`parentNode.removeChild(childNode)\`.
`,
		},
		{
			code: `
element.parentNode.removeChild(element);
`,
			snapshot: `
element.parentNode.removeChild(element);
                   ~~~~~~~~~~~
                   Prefer the modern \`element.remove()\` over \`element.parentNode.removeChild(element)\`.
`,
		},
		{
			code: `
node.parentElement.removeChild(node);
`,
			snapshot: `
node.parentElement.removeChild(node);
                   ~~~~~~~~~~~
                   Prefer the modern \`node.remove()\` over \`node.parentElement.removeChild(node)\`.
`,
		},
		{
			code: `
this.parentNode.removeChild(this);
`,
			snapshot: `
this.parentNode.removeChild(this);
                ~~~~~~~~~~~
                Prefer the modern \`this.remove()\` over \`this.parentNode.removeChild(this)\`.
`,
		},
		{
			code: `
document.body.removeChild(footer);
`,
			snapshot: `
document.body.removeChild(footer);
              ~~~~~~~~~~~
              Prefer the modern \`footer.remove()\` over \`document.body.removeChild(footer)\`.
`,
		},
	],
	valid: [
		`element.remove();`,
		`node.remove();`,
		`this.remove();`,
		`child.parentNode.appendChild(child);`,
		`parent.replaceChild(newChild, oldChild);`,
		`other.removeChild();`,
		`removeChild(node);`,
	],
});
