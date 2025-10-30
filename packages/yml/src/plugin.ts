import { createPlugin } from "@flint.fyi/core";

import blockMappings from "./rules/blockMappings.js";
import emptyMappingKeys from "./rules/emptyMappingKeys.js";

export const yml = createPlugin({
	files: {
		all: ["**/*.{yaml,yml}"],
	},
	name: "yml",
	rules: [blockMappings, emptyMappingKeys],
});
