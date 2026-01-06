import { createPlugin } from "@flint.fyi/core";

import blockMappings from "./rules/blockMappings.ts";
import emptyMappingKeys from "./rules/emptyMappingKeys.ts";

export const yaml = createPlugin({
	files: {
		all: ["**/*.{yaml,yml}"],
	},
	name: "YAML",
	rules: [blockMappings, emptyMappingKeys],
});
