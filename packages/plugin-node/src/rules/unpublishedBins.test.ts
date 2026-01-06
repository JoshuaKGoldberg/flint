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
This bin file 'bin/cli.ts' will not be published with the package.
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
This bin file 'bin/cli.ts' will not be published with the package.
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
