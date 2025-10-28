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
parent.insertBefore(child, null);
`,
			snapshot: `
parent.insertBefore(child, null);
       ~~~~~~~~~~~~
       Prefer \`append()\` over \`insertBefore()\`.
`,
		},
		{
			code: `
parent.insertBefore(child, parent.firstChild);
`,
			snapshot: `
parent.insertBefore(child, parent.firstChild);
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
		`element.append(child);`,
		`node.prepend(newNode);`,
		`element.append(child1, child2);`,
		`element.append("text");`,
		`parent.append(child);`,
		`other.method();`,
		`parent.insertBefore(child, referenceNode);`,
	],
});
