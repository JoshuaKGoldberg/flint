import { createPlugin } from "@flint.fyi/core";

import blockSequences from "./rules/blockSequences.js";
import emptyMappingKeys from "./rules/emptyMappingKeys.js";

export const yml = createPlugin({
	files: {
		all: ["**/*.{yaml,yml}"],
	},
	name: "yml",
	rules: [blockSequences, emptyMappingKeys],
});
