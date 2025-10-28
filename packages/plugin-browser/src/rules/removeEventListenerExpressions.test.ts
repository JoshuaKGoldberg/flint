import rule from "./removeEventListenerExpressions.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
element.removeEventListener("click", () => {});
`,
			snapshot: `
element.removeEventListener("click", () => {});
                                     ~~~~~~~~
                                     Inline function expressions in \`removeEventListener\` calls will not remove the listener.
`,
		},
		{
			code: `
element.removeEventListener("click", function () {});
`,
			snapshot: `
element.removeEventListener("click", function () {});
                                     ~~~~~~~~~~~~~~
                                     Inline function expressions in \`removeEventListener\` calls will not remove the listener.
`,
		},
		{
			code: `
element.removeEventListener("click", () => console.log("clicked"));
`,
			snapshot: `
element.removeEventListener("click", () => console.log("clicked"));
                                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                                     Inline function expressions in \`removeEventListener\` calls will not remove the listener.
`,
		},
		{
			code: `
document.getElementById("button").removeEventListener("mouseover", function handler() {
    console.log("hover");
});
`,
			snapshot: `
document.getElementById("button").removeEventListener("mouseover", function handler() {
                                                                   ~~~~~~~~~~~~~~~~~~~~
                                                                   Inline function expressions in \`removeEventListener\` calls will not remove the listener.
    console.log("hover");
    ~~~~~~~~~~~~~~~~~~~~~
});
~
`,
		},
		{
			code: `
window.removeEventListener("resize", () => resize());
`,
			snapshot: `
window.removeEventListener("resize", () => resize());
                                     ~~~~~~~~~~~~~~
                                     Inline function expressions in \`removeEventListener\` calls will not remove the listener.
`,
		},
	],
	valid: [
		`element.removeEventListener("click", handler);`,
		`element.removeEventListener("click", this.handler);`,
		`element.removeEventListener("click", obj.handler);`,
		`element.addEventListener("click", handler);`,
		`const handler = () => console.log("clicked");
element.removeEventListener("click", handler);`,
		`function handler() { console.log("clicked"); }
element.removeEventListener("click", handler);`,
		`element.removeEventListener("click", null);`,
		`element.removeEventListener("click");`,
	],
});
