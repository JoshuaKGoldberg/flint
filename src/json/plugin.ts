import { createPlugin } from "../plugins/createPlugin.js";
import duplicateKeys from "./rules/duplicateKeys.js";

export const json = createPlugin({
	globs: {
		all: ["**/*.json"],
	},
	name: "json",
	rules: [duplicateKeys],
});
