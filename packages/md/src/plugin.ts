import { createPlugin } from "@flint.fyi/core";

import bareUrls from "./rules/bareUrls.js";
import headingDuplicates from "./rules/headingDuplicates.js";
import headingIncrements from "./rules/headingIncrements.js";

export const md = createPlugin({
	files: {
		all: ["**/*.md"],
	},
	name: "md",
	rules: [bareUrls, headingDuplicates, headingIncrements],
});
