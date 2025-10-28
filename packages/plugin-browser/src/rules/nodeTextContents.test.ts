import rule from "./nodeTextContents.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const text = element.innerText;
`,
			snapshot: `
const text = element.innerText;
                     ~~~~~~~~~
                     Prefer \`textContent\` over \`innerText\`.
`,
		},
		{
			code: `
element.innerText = "Hello";
`,
			snapshot: `
element.innerText = "Hello";
        ~~~~~~~~~
        Prefer \`textContent\` over \`innerText\`.
`,
		},
		{
			code: `
const content = node.innerText;
`,
			snapshot: `
const content = node.innerText;
                     ~~~~~~~~~
                     Prefer \`textContent\` over \`innerText\`.
`,
		},
		{
			code: `
div.innerText = value;
`,
			snapshot: `
div.innerText = value;
    ~~~~~~~~~
    Prefer \`textContent\` over \`innerText\`.
`,
		},
		{
			code: `
const text = document.getElementById("id").innerText;
`,
			snapshot: `
const text = document.getElementById("id").innerText;
                                           ~~~~~~~~~
                                           Prefer \`textContent\` over \`innerText\`.
`,
		},
	],
	valid: [
		`const text = element.textContent;`,
		`element.textContent = "Hello";`,
		`const content = node.textContent;`,
		`div.textContent = value;`,
		`const text = document.getElementById("id").textContent;`,
		`const obj = { innerText: "value" };`,
		`const innerText = "some text";`,
	],
});
