import rule from "./unsupportedNodeAPIs.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
import { webcrypto } from "crypto";
`,
			snapshot: `
import { webcrypto } from "crypto";
         ~~~~~~~~~
         The \`crypto.webcrypto\` API requires Node.js 15.0.0 or higher.
`,
		},
		{
			code: `
import { webcrypto } from "node:crypto";
`,
			snapshot: `
import { webcrypto } from "node:crypto";
         ~~~~~~~~~
         The \`crypto.webcrypto\` API requires Node.js 15.0.0 or higher.
`,
		},
		{
			code: `
import * as crypto from "crypto";
const webCrypto = crypto.webcrypto;
`,
			snapshot: `
import * as crypto from "crypto";
const webCrypto = crypto.webcrypto;
                         ~~~~~~~~~
                         The \`crypto.webcrypto\` API requires Node.js 15.0.0 or higher.
`,
		},
		{
			code: `
import * as fs from "fs";
const blob = await fs.openAsBlob("file.txt");
`,
			snapshot: `
import * as fs from "fs";
const blob = await fs.openAsBlob("file.txt");
                      ~~~~~~~~~~
                      The \`fs.openAsBlob\` API requires Node.js 14.0.0 or higher.
`,
		},
	],
	valid: [
		`import { randomBytes } from "crypto";`,
		`import { readFile } from "fs";`,
		`import * as path from "path";`,
		`import { EventEmitter } from "events";`,
		`const crypto = require("crypto");`,
	],
});
