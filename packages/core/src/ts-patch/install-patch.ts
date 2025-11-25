import fs from "node:fs";
import { createRequire } from "node:module";
import { transformTscContent } from "./shared.js";

const require = createRequire(import.meta.url);
const typescriptPath = require.resolve("typescript");

const origReadFileSync = fs.readFileSync;
// @ts-expect-error
fs.readFileSync = (...args) => {
	const res = origReadFileSync(...args);
	if (args[0] === typescriptPath) {
		return transformTscContent(res.toString());
	}
	return res;
};
require("typescript");
fs.readFileSync = origReadFileSync;
