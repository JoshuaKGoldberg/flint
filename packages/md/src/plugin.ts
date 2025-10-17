import { createPlugin } from "@flint.fyi/core";

import bareUrls from "./rules/bareUrls.js";
import headingIncrements from "./rules/headingIncrements.js";
import mediaSyntaxReversals from "./rules/mediaSyntaxReversals.js";

export const md = createPlugin({
	files: {
		all: ["**/*.md"],
	},
	name: "md",
	rules: [bareUrls, headingIncrements, mediaSyntaxReversals],
});
