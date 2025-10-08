import { createPlugin } from "@flint.fyi/core";

import consecutiveNonNullAssertions from "./rules/consecutiveNonNullAssertions.js";
import debuggerStatements from "./rules/debuggerStatements.js";
import forInArrays from "./rules/forInArrays.js";
import namespaceDeclarations from "./rules/namespaceDeclarations.js";
import newExpressions from "./rules/newExpressions.js";
import octalEscapes from "./rules/octalEscapes.js";

export const ts = createPlugin({
	files: {
		all: ["**/*.{cjs,js,jsx,mjs,ts,tsx}"],
	},
	name: "ts",
	rules: [
		consecutiveNonNullAssertions,
		debuggerStatements,
		forInArrays,
		namespaceDeclarations,
		newExpressions,
		octalEscapes,
	],
});
