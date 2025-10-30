import { createPlugin } from "@flint.fyi/core";

import emptyMappingKeys from "./rules/emptyMappingKeys.js";

export const yml = createPlugin({
	files: {
		all: ["**/*.{yaml,yml}"],
	},
	name: "yml",
	rules: [emptyMappingKeys],
});
