import { createPlugin } from "@flint.fyi/core";

import testCaseDuplicates from "./rules/testCaseDuplicates.js";

export const flint = createPlugin({
	name: "flint",
	rules: [testCaseDuplicates],
});
