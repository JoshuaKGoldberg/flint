import { createPlugin } from "@flint.fyi/core";

import blockMappings from "./rules/blockMappings.ts";
import emptyDocuments from "./rules/emptyDocuments.ts";
import emptyMappingKeys from "./rules/emptyMappingKeys.ts";

export const yaml = createPlugin({
	files: {
		all: ["**/*.{yaml,yml}"],
	},
	name: "YAML",
	rules: [blockMappings, emptyDocuments, emptyMappingKeys],
});
