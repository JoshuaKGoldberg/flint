import { createPlugin } from "@flint.fyi/core";

import keyDuplicates from "./rules/keyDuplicates.js";
import keyNormalization from "./rules/keyNormalization.js";
import valueSafety from "./rules/valueSafety.js";

export const json = createPlugin({
	files: {
		all: ["**/*.json"],
	},
	name: "JSON",
	rules: [keyDuplicates, keyNormalization, valueSafety],
});

export const packageJson = createPlugin({
	files: {
		all: ["**/package.json"],
	},
	name: "PackageJSON",
	rules: [keyDuplicates, keyNormalization, valueSafety],
});
