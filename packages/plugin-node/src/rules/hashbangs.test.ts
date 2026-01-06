/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import path from "node:path";

import rule from "./hashbangs.ts";
import { ruleTester } from "./ruleTester.ts";

const testFixtureDir = path.resolve(
	import.meta.dirname,
	"../../test-fixtures/hashbangs-bin-test",
);

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
console.log("hello");
`,
			fileName: path.join(testFixtureDir, "bin/cli.ts"),
			snapshot: `
console.log("hello");
~~~~~~~~~~~~~~~~~~~~~
Files listed in package.json's bin field require a hashbang to execute properly.
`,
		},
		{
			code: `#!/usr/bin/env node
console.log("hello");
`,
			fileName: path.join(testFixtureDir, "src/index.ts"),
			snapshot: `#!/usr/bin/env node
~~~~~~~~~~~~~~~~~~~
Hashbangs are only needed for files listed in package.json's bin field.
console.log("hello");

`,
		},
	],
	valid: [
		{
			code: `#!/usr/bin/env node
console.log("hello");
`,
			fileName: path.join(testFixtureDir, "bin/cli.ts"),
		},
		{
			code: `console.log("hello");
`,
			fileName: path.join(testFixtureDir, "src/index.ts"),
		},
		`console.log("no package.json");`,
	],
});
/* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
