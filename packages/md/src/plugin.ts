import { createPlugin } from "@flint.fyi/core";

import bareUrls from "./rules/bareUrls.js";
import headingIncrements from "./rules/headingIncrements.js";
import imageContents from "./rules/imageContents.js";

export const md = createPlugin({
	files: {
		all: ["**/*.md"],
	},
	name: "md",
	rules: [bareUrls, headingIncrements, imageContents],
});
