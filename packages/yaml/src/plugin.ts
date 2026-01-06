import { createPlugin } from "@flint.fyi/core";

import emptyMappingKeys from "./rules/emptyMappingKeys.ts";

export const yaml = createPlugin({
	files: {
		all: ["**/*.{yaml,yml}"],
	},
	name: "YAML",
	rules: [emptyMappingKeys],
});
