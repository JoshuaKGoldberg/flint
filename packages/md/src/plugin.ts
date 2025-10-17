import { createPlugin } from "@flint.fyi/core";

import bareUrls from "./rules/bareUrls.js";
import headingIncrements from "./rules/headingIncrements.js";
import linkContents from "./rules/linkContents.js";

export const md = createPlugin({
	files: {
		all: ["**/*.md"],
	},
	name: "md",
	rules: [bareUrls, headingIncrements, linkContents],
});
