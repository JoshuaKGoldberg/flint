import { createPlugin } from "@flint.fyi/core";

import consecutiveNonNullAssertions from "./rules/consecutiveNonNullAssertions.js";
import forInArrays from "./rules/forInArrays.js";
import namespaceDeclarations from "./rules/namespaceDeclarations.js";

export const ts = createPlugin({
	files: {
		all: ["**/*.{cjs,js,jsx,mjs,ts,tsx}"],
	},
	name: "ts",
	rules: [consecutiveNonNullAssertions, forInArrays, namespaceDeclarations],
});
