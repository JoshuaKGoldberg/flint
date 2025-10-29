import { createPlugin } from "@flint.fyi/core";

import assertStrict from "./rules/assertStrict.js";
import assertStyles from "./rules/assertStyles.js";
import blobReadingMethods from "./rules/blobReadingMethods.js";
import bufferAllocators from "./rules/bufferAllocators.js";
import eventClasses from "./rules/eventClasses.js";

export const node = createPlugin({
	name: "node",
	rules: [
		assertStrict,
		assertStyles,
		blobReadingMethods,
		bufferAllocators,
		eventClasses,
	],
});
