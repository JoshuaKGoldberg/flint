import { createPlugin } from "@flint.fyi/core";

import invalidCodeLines from "./rules/invalidCodeLines.js";
import testCaseDuplicates from "./rules/testCaseDuplicates.js";

export const flint = createPlugin({
	name: "Flint",
	rules: [invalidCodeLines, testCaseDuplicates],
});
