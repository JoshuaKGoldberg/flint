import rule from "./nodeAppendMethods.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
element.appendChild(child);
`,
			snapshot: `
element.appendChild(child);
        ~~~~~~~~~~~
        Prefer \`append()\` over \`appendChild()\`.
`,
		},
		{
			code: `
node.insertBefore(newNode, referenceNode);
`,
			snapshot: `
node.insertBefore(newNode, referenceNode);
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
		{
			code: `
parent.insertBefore(child, null);
`,
			snapshot: `
parent.insertBefore(child, null);
       ~~~~~~~~~~~~
       Prefer \`prepend()\` over \`insertBefore()\`.
`,
		},
	],
	valid: [
		`element.append(child);`,
		`node.prepend(newNode);`,
		`element.append(child1, child2);`,
		`element.append("text");`,
		`parent.append(child);`,
		`other.method();`,
	],
});
