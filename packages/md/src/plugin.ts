import { createPlugin } from "@flint.fyi/core";

import headingIncrements from "./rules/headingIncrements.js";

export const md = createPlugin({
	files: {
		all: ["**/*.md"],
	},
	name: "md",
	rules: [headingIncrements],
});
