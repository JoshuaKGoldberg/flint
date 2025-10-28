import rule from "./nodeDatasetAttributes.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
element.getAttribute("data-foo");
`,
			snapshot: `
element.getAttribute("data-foo");
        ~~~~~~~~~~~~
        Prefer \`element.dataset.foo\` over \`element.getAttribute('data-foo')\`.
`,
		},
		{
			code: `
element.setAttribute("data-foo", "bar");
`,
			snapshot: `
element.setAttribute("data-foo", "bar");
        ~~~~~~~~~~~~
        Prefer \`element.dataset.foo = ...\` over \`element.setAttribute('data-foo', ...)\`.
`,
		},
		{
			code: `
element.removeAttribute("data-foo");
`,
			snapshot: `
element.removeAttribute("data-foo");
        ~~~~~~~~~~~~~~~
        Prefer \`delete element.dataset.foo\` over \`element.removeAttribute('data-foo')\`.
`,
		},
		{
			code: `
element.hasAttribute("data-foo");
`,
			snapshot: `
element.hasAttribute("data-foo");
        ~~~~~~~~~~~~
        Prefer \`'foo' in element.dataset\` over \`element.hasAttribute('data-foo')\`.
`,
		},
		{
			code: `
node.getAttribute("data-foo-bar");
`,
			snapshot: `
node.getAttribute("data-foo-bar");
     ~~~~~~~~~~~~
     Prefer \`node.dataset.fooBar\` over \`node.getAttribute('data-foo-bar')\`.
`,
		},
		{
			code: `
element.setAttribute("data-my-value", value);
`,
			snapshot: `
element.setAttribute("data-my-value", value);
        ~~~~~~~~~~~~
        Prefer \`element.dataset.myValue = ...\` over \`element.setAttribute('data-my-value', ...)\`.
`,
		},
		{
			code: `
element.getAttribute(\`data-foo\`);
`,
			snapshot: `
element.getAttribute(\`data-foo\`);
        ~~~~~~~~~~~~
        Prefer \`element.dataset.foo\` over \`element.getAttribute('data-foo')\`.
`,
		},
	],
	valid: [
		`element.getAttribute("aria-label");`,
		`element.setAttribute("id", "value");`,
		`element.getAttribute("data");`,
		`element.getAttribute("data-");`,
		`element.removeAttribute("class");`,
		`element.hasAttribute("hidden");`,
		`element.getAttribute(variable);`,
		`element.dataset.foo;`,
		`
			declare const element: {
				getAttribute(name: string): string;
			};
			element.getAttribute("data-foo");
			export {};
		`,
	],
});
