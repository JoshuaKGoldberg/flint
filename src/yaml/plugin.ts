import { createPlugin } from "../plugins/createPlugin.js";
import emptyMappingKeys from "./rules/emptyMappingKeys.js";

export const yaml = createPlugin({
	globs: {
		all: ["**/*.{yaml,yml}"],
	},
	name: "md",
	rules: [emptyMappingKeys],
});
