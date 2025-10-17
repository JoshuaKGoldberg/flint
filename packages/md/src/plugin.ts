import { createPlugin } from "@flint.fyi/core";

import bareUrls from "./rules/bareUrls.js";
import definitionDuplicates from "./rules/definitionDuplicates.js";
import headingIncrements from "./rules/headingIncrements.js";

export const md = createPlugin({
	files: {
		all: ["**/*.md"],
	},
	name: "md",
	rules: [bareUrls, definitionDuplicates, headingIncrements],
});
