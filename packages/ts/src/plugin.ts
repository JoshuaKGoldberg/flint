import { createPlugin } from "@flint.fyi/core";

import asyncPromiseExecutors from "./rules/asyncPromiseExecutors.js";
import consecutiveNonNullAssertions from "./rules/consecutiveNonNullAssertions.js";
import debuggerStatements from "./rules/debuggerStatements.js";
import forInArrays from "./rules/forInArrays.js";
import namespaceDeclarations from "./rules/namespaceDeclarations.js";
import octalEscapes from "./rules/octalEscapes.js";

export const ts = createPlugin({
	files: {
		all: ["**/*.{cjs,js,jsx,mjs,ts,tsx}"],
	},
	name: "ts",
	rules: [
		asyncPromiseExecutors,
		consecutiveNonNullAssertions,
		debuggerStatements,
		forInArrays,
		namespaceDeclarations,
		octalEscapes,
	],
});
