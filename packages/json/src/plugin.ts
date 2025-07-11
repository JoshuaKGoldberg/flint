import { createPlugin } from "@flint/core";

import duplicateKeys from "./rules/duplicateKeys.js";

export const json = createPlugin({
	globs: {
		all: ["**/*.json"],
	},
	name: "json",
	rules: [duplicateKeys],
});
