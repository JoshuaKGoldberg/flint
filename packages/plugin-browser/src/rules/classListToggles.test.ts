import { expect } from "vitest";

import rule from "./classListToggles.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
if (condition) {
    element.classList.add("active");
} else {
    element.classList.remove("active");
}
`,
			output: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					element.classList.toggle("active", condition);
					"
				`);
			},
			snapshot: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					if (condition) {
					    element.classList.add("active");
					                      ~~~
					                      Prefer using \`classList.toggle()\` instead of conditional \`classList.add()\` and \`classList.remove()\`.
					} else {
					    element.classList.remove("active");
					}
					"
				`);
			},
		},
		{
			code: `
if (isVisible) {
    button.classList.remove("hidden");
} else {
    button.classList.add("hidden");
}
`,
			output: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					button.classList.toggle("hidden", !(isVisible));
					"
				`);
			},
			snapshot: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					if (isVisible) {
					    button.classList.remove("hidden");
					                     ~~~~~~
					                     Prefer using \`classList.toggle()\` instead of conditional \`classList.add()\` and \`classList.remove()\`.
					} else {
					    button.classList.add("hidden");
					}
					"
				`);
			},
		},
		{
			code: `
if (flag)
    element.classList.add("active");
else
    element.classList.remove("active");
`,
			output: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					element.classList.toggle("active", flag);
					"
				`);
			},
			snapshot: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					if (flag)
					    element.classList.add("active");
					                      ~~~
					                      Prefer using \`classList.toggle()\` instead of conditional \`classList.add()\` and \`classList.remove()\`.
					else
					    element.classList.remove("active");
					"
				`);
			},
		},
	],
	valid: [
		`element.classList.toggle("active", condition);`,
		`element.classList.add("active");`,
		`element.classList.remove("active");`,
		`
			if (condition) {
				element.classList.add("active");
			}
		`,
		`
			if (condition) {
				element.classList.add("active");
			} else {
				element.classList.add("inactive");
			}
		`,
		`
			if (condition) {
				element.classList.add("active");
			} else {
				element.classList.remove("inactive");
			}
		`,
		`
			if (condition) {
				element.classList.add("active");
				console.log("added");
			} else {
				element.classList.remove("active");
			}
		`,
		`
			if (condition) {
				element.classList.add("class1");
			} else {
				element.classList.remove("class2");
			}
		`,
		`
			if (condition) {
				element1.classList.add("active");
			} else {
				element2.classList.remove("active");
			}
		`,
	],
});
