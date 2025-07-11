import { createPlugin } from "@flint/core";

import headingIncrements from "./rules/headingIncrements.js";

export const md = createPlugin({
	globs: {
		all: ["**/*.md"],
	},
	name: "md",
	rules: [headingIncrements],
});
