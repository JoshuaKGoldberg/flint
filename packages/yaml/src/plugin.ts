import { createPlugin } from "@flint.fyi/core";

import emptyDocuments from "./rules/emptyDocuments.ts";
import emptyMappingKeys from "./rules/emptyMappingKeys.ts";

export const yaml = createPlugin({
	files: {
		all: ["**/*.{yaml,yml}"],
	},
	name: "YAML",
	rules: [emptyDocuments, emptyMappingKeys],
});
