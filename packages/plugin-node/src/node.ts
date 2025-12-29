import { createPlugin } from "@flint.fyi/core";

import assertStrict from "./rules/assertStrict.ts";
import assertStyles from "./rules/assertStyles.ts";
import blobReadingMethods from "./rules/blobReadingMethods.ts";
import bufferAllocators from "./rules/bufferAllocators.ts";
import eventClasses from "./rules/eventClasses.ts";
import exportsAssignments from "./rules/exportsAssignments.ts";

export const node = createPlugin({
	name: "Node.js",
	rules: [
		assertStrict,
		assertStyles,
		blobReadingMethods,
		bufferAllocators,
		eventClasses,
		exportsAssignments,
	],
});
