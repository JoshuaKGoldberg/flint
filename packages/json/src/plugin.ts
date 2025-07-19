import { createPlugin } from "@flint.fyi/core";

import duplicateKeys from "./rules/duplicateKeys.js";

export const json = createPlugin({
	files: {
		all: ["**/*.json"],
	},
	name: "json",
	rules: [duplicateKeys],
});
