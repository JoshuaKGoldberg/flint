import rule from "./alerts.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
alert("...");
`,
			only: true,
			snapshot: `
alert("...");
~~~~~
The global \`alert()\` API blocks the main thread and interrupts users.
`,
		},
		{
			code: `
window.alert("...");
`,
			snapshot: `
window.alert("...");

window.alert("...");
       ~~~~~
       The global \`alert()\` API blocks the main thread and interrupts users.
`,
		},
		{
			code: `
globalThis.confirm("...");
`,
			snapshot: `
globalThis.confirm("...");

globalThis.confirm("...");
           ~~~~~~~
           The global \`confirm()\` API blocks the main thread and interrupts users.
`,
		},
		{
			code: `
self.confirm("...");
`,
			snapshot: `
self.confirm("...");

self.confirm("...");
     ~~~~~~~
     The global \`confirm()\` API blocks the main thread and interrupts users.
`,
		},
	],
	valid: [
		`console.log("...");`,
		`window.console.log("x");`,
		`other.alert();`,
		`
			declare function alert(message: string): void;
			alert("...");
			export {};
		`,
	],
});
