import path from "node:path";

import rule from "./hashbangs.js";
import { ruleTester } from "./ruleTester.js";

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
Executable files must start with a hashbang.
`,
		},
		{
			code: `#!/usr/bin/env node
console.log("hello");
`,
			fileName: path.join(testFixtureDir, "src/index.ts"),
			snapshot: `#!/usr/bin/env node
~~~~~~~~~~~~~~~~~~~
Non-executable files must not have a hashbang.
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
