import { createPlugin } from "@flint.fyi/core";

import bareUrls from "./rules/bareUrls.js";
import definitionUses from "./rules/definitionUses.js";
import headingIncrements from "./rules/headingIncrements.js";

export const md = createPlugin({
	files: {
		all: ["**/*.md"],
	},
	name: "md",
	rules: [bareUrls, definitionUses, headingIncrements],
});
