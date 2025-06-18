import { createPlugin } from "../plugins/createPlugin.js";
import headingIncrements from "./rules/headingIncrements.js";

export const md = createPlugin({
	globs: {
		all: ["**/*.md"],
	},
	name: "md",
	rules: [headingIncrements],
});
