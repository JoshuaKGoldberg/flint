import { createPlugin } from "@flint.fyi/core";

import keyDuplicates from "./rules/keyDuplicates.js";

export const json = createPlugin({
	files: {
		all: ["**/*.json"],
	},
	name: "json",
	rules: [keyDuplicates],
});
