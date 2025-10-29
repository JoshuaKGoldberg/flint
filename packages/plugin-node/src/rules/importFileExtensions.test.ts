import rule from "./importFileExtensions.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
import value from "./module";
`,
			snapshot: `
import value from "./module";
                  ~~~~~~~~~~
                  Import and export statements should include file extensions for local files.
`,
		},
		{
			code: `
import value from "../parent/module";
`,
			snapshot: `
import value from "../parent/module";
                  ~~~~~~~~~~~~~~~~~~
                  Import and export statements should include file extensions for local files.
`,
		},
		{
			code: `
import { named } from "./utilities";
`,
			snapshot: `
import { named } from "./utilities";
                      ~~~~~~~~~~~~~
                      Import and export statements should include file extensions for local files.
`,
		},
		{
			code: `
import * as utils from "./utils";
`,
			snapshot: `
import * as utils from "./utils";
                       ~~~~~~~~~
                       Import and export statements should include file extensions for local files.
`,
		},
		{
			code: `
export { value } from "./module";
`,
			snapshot: `
export { value } from "./module";
                      ~~~~~~~~~~
                      Import and export statements should include file extensions for local files.
`,
		},
		{
			code: `
export * from "./module";
`,
			snapshot: `
export * from "./module";
              ~~~~~~~~~~
              Import and export statements should include file extensions for local files.
`,
		},
		{
			code: `
export * as utils from "./utilities";
`,
			snapshot: `
export * as utils from "./utilities";
                       ~~~~~~~~~~~~~
                       Import and export statements should include file extensions for local files.
`,
		},
		{
			code: `
import type { Type } from "./types";
`,
			snapshot: `
import type { Type } from "./types";
                          ~~~~~~~~~
                          Import and export statements should include file extensions for local files.
`,
		},
	],
	valid: [
		`import value from "./module.js";`,
		`import value from "./module.mjs";`,
		`import value from "./module.cjs";`,
		`import value from "../parent/module.js";`,
		`import { named } from "./utilities.js";`,
		`import * as utils from "./utils.js";`,
		`import config from "./config.json";`,
		`export { value } from "./module.js";`,
		`export * from "./module.js";`,
		`export * as utils from "./utilities.js";`,
		`import type { Type } from "./types.js";`,
		`import value from "module";`,
		`import value from "node:fs";`,
		`import value from "@scope/package";`,
		`import value from "react";`,
		`export { value } from "external-package";`,
		`import value from ".env";`,
		`import value from "..config";`,
	],
});
