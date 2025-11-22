import { createPlugin } from "@flint.fyi/core";

import emptyMappingKeys from "./rules/emptyMappingKeys.js";

export const yaml = createPlugin({
	files: {
		all: ["**/*.{yaml,yml}"],
	},
	name: "yaml",
	rules: [emptyMappingKeys],
});
