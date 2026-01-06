/* eslint-disable @typescript-eslint/no-unsafe-call */
import { join, resolve } from "node:path";

import { ruleTester } from "./ruleTester.ts";
import rule from "./unpublishedBins.ts";

const fixturesPath = resolve(import.meta.dirname, "../../../fixtures");

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
#!/usr/bin/env node
console.log("Hello from CLI");
`,
			fileName: join(fixturesPath, "unpublished-bin-ignored/bin/cli.ts"),
			snapshot: `
#!/usr/bin/env node
~~~~~~~~~~~~~~~~~~~
npm ignores 'bin/cli.ts'. Ensure it is included in the 'files' field of 'package.json' or not excluded by '.npmignore'.
console.log("Hello from CLI");
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

`,
		},
		{
			code: `
#!/usr/bin/env node
console.log("CLI tool");
`,
			fileName: join(fixturesPath, "unpublished-bin-npmignore/bin/cli.ts"),
			snapshot: `
#!/usr/bin/env node
~~~~~~~~~~~~~~~~~~~
npm ignores 'bin/cli.ts'. Ensure it is included in the 'files' field of 'package.json' or not excluded by '.npmignore'.
console.log("CLI tool");
~~~~~~~~~~~~~~~~~~~~~~~~

`,
		},
	],
	valid: [
		{
			code: `#!/usr/bin/env node
console.log("Hello from CLI");
`,
			fileName: join(fixturesPath, "unpublished-bin-included/bin/cli.ts"),
		},
		{
			code: `console.log("regular file");`,
			fileName: join(fixturesPath, "unpublished-bin-included/lib/index.ts"),
		},
	],
});
/* eslint-enable @typescript-eslint/no-unsafe-call */
