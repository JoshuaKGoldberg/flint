import { ruleTester } from "./ruleTester.js";
import rule from "./windowMessagingTargetOrigin.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
window.postMessage("message");
`,
			snapshot: `
window.postMessage("message");
       ~~~~~~~~~~~
       The \`postMessage()\` call is missing the required \`targetOrigin\` argument.
`,
		},
		{
			code: `
self.postMessage("message");
`,
			snapshot: `
self.postMessage("message");
     ~~~~~~~~~~~
     The \`postMessage()\` call is missing the required \`targetOrigin\` argument.
`,
		},
		{
			code: `
globalThis.postMessage("message");
`,
			snapshot: `
globalThis.postMessage("message");
           ~~~~~~~~~~~
           The \`postMessage()\` call is missing the required \`targetOrigin\` argument.
`,
		},
		{
			code: `
parent.postMessage("message");
`,
			snapshot: `
parent.postMessage("message");
       ~~~~~~~~~~~
       The \`postMessage()\` call is missing the required \`targetOrigin\` argument.
`,
		},
		{
			code: `
top.postMessage("message");
`,
			snapshot: `
top.postMessage("message");
    ~~~~~~~~~~~
    The \`postMessage()\` call is missing the required \`targetOrigin\` argument.
`,
		},
	],
	valid: [
		`window.postMessage("message", "https://example.com");`,
		`window.postMessage("message", "*");`,
		`self.postMessage("message", "https://example.com");`,
		`globalThis.postMessage("message", "*");`,
		`parent.postMessage("message", "https://example.com");`,
		`top.postMessage("message", "*");`,
		`worker.postMessage("message");`,
		`messagePort.postMessage("message");`,
		`broadcastChannel.postMessage("message");`,
		`otherObject.postMessage("message");`,
		`
			declare const other: { postMessage(message: string): void };
			other.postMessage("message");
		`,
		`
			declare const window: { postMessage(message: string): void };
			window.postMessage("message");
			export {};
		`,
	],
});
