import { createPlugin } from "@flint.fyi/core";

import emptyDocuments from "./rules/emptyDocuments.js";
import emptyMappingKeys from "./rules/emptyMappingKeys.js";

export const yml = createPlugin({
	files: {
		all: ["**/*.{yaml,yml}"],
	},
	name: "md",
	rules: [emptyDocuments, emptyMappingKeys],
});
