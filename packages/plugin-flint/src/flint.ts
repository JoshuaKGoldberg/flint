import { createPlugin } from "@flint.fyi/core";

import duplicateTestCases from "./rules/duplicateTestCases.js";
import invalidCodeLines from "./rules/invalidCodeLines.js";
import testCaseDuplicates from "./rules/testCaseDuplicates.js";

export const flint = createPlugin({
	name: "flint",
	rules: [duplicateTestCases, invalidCodeLines, testCaseDuplicates],
});
