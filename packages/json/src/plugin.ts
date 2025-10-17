import { createPlugin } from "@flint.fyi/core";

import keyDuplicates from "./rules/keyDuplicates.js";
import valueSafety from "./rules/valueSafety.js";

export const json = createPlugin({
	files: {
		all: ["**/*.json"],
	},
	name: "json",
	rules: [keyDuplicates, valueSafety],
});
