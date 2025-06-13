import { createPlugin } from "../plugins/createPlugin.js";
import consecutiveNonNullAssertions from "../rules/consecutiveNonNullAssertions.js";
import forInArrays from "../rules/forInArrays.js";
import namespaceDeclarations from "../rules/namespaceDeclarations.js";

const rules = [
	forInArrays,
	consecutiveNonNullAssertions,
	namespaceDeclarations,
];

export const ts = createPlugin({
	globs: {
		all: ["**/*.{cjs,js,jsx,mjs,ts,tsx}"],
	},
	name: "ts",
	rules,
});
