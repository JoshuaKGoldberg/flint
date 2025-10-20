import { createPlugin } from "@flint.fyi/core";

import bareUrls from "./rules/bareUrls.js";
import definitionContents from "./rules/definitionContents.js";
import definitionDuplicates from "./rules/definitionDuplicates.js";
import fencedCodeLanguages from "./rules/fencedCodeLanguages.js";
import headingIncrements from "./rules/headingIncrements.js";
import imageAltTexts from "./rules/imageAltTexts.js";
import imageContents from "./rules/imageContents.js";
import linkContents from "./rules/linkContents.js";

export const md = createPlugin({
	files: {
		all: ["**/*.md"],
	},
	name: "md",
	rules: [
		bareUrls,
		definitionDuplicates,
		definitionContents,
		fencedCodeLanguages,
		headingIncrements,
		imageAltTexts,
		imageContents,
		linkContents,
	],
});
