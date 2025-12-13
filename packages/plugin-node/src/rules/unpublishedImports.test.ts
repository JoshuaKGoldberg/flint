import { ruleTester } from "./ruleTester.js";
import rule from "./unpublishedImports.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
import vitest from "vitest";
`,
			snapshot: `
import vitest from "vitest";
                   ~~~~~~~~
                   Importing from devDependencies in production code can cause runtime errors.
`,
		},
		{
			code: `
import { describe } from "vitest";
`,
			snapshot: `
import { describe } from "vitest";
                         ~~~~~~~~
                         Importing from devDependencies in production code can cause runtime errors.
`,
		},
		{
			code: `
import vitest = require("vitest");
`,
			snapshot: `
import vitest = require("vitest");
                        ~~~~~~~~
                        Importing from devDependencies in production code can cause runtime errors.
`,
		},
	],
	valid: [
		`import fs from "node:fs";`,
		`import { readFile } from "fs";`,
		`import path from "path";`,
		`import assert from "node:assert/strict";`,
		`import { createRule } from "@flint.fyi/core";`,
		`import { parseJsonSafe } from "@flint.fyi/utils";`,
		`import { something } from "./local-file";`,
		`import { another } from "../parent-file";`,
	],
});
