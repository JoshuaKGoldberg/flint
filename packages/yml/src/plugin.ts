import { createPlugin } from "@flint.fyi/core";

import emptyMappingKeys from "./rules/emptyMappingKeys.js";

export const yml = createPlugin({
	globs: {
		all: ["**/*.{yaml,yml}"],
	},
	name: "md",
	rules: [emptyMappingKeys],
});
