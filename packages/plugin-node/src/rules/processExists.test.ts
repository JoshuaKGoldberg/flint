import rule from "./processExists.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
process.exit(0);
`,
			snapshot: `
process.exit(0);
~~~~~~~~~~~~
Prefer throwing errors or returning exit codes over calling \`process.exit()\` directly.
`,
		},
		{
			code: `
process.exit(1);
`,
			snapshot: `
process.exit(1);
~~~~~~~~~~~~
Prefer throwing errors or returning exit codes over calling \`process.exit()\` directly.
`,
		},
		{
			code: `
process.exit();
`,
			snapshot: `
process.exit();
~~~~~~~~~~~~
Prefer throwing errors or returning exit codes over calling \`process.exit()\` directly.
`,
		},
		{
			code: `
function exitHandler() {
    process.exit(1);
}
`,
			snapshot: `
function exitHandler() {
    process.exit(1);
    ~~~~~~~~~~~~
    Prefer throwing errors or returning exit codes over calling \`process.exit()\` directly.
}
`,
		},
		{
			code: `
if (error) {
    process.exit(1);
}
`,
			snapshot: `
if (error) {
    process.exit(1);
    ~~~~~~~~~~~~
    Prefer throwing errors or returning exit codes over calling \`process.exit()\` directly.
}
`,
		},
	],
	valid: [
		`throw new Error("Application failed");`,
		`function main() { return 1; }`,
		`const exitCode = 1;`,
		`const exit = () => {};`,
		`const obj = { exit: () => {} }; obj.exit();`,
	],
});
