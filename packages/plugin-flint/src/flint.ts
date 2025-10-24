import { createPlugin } from "@flint.fyi/core";

import duplicateTestCases from "./rules/duplicateTestCases.js";
import invalidCodeLines from "./rules/invalidCodeLines.js";

export const flint = createPlugin({
	name: "flint",
	rules: [duplicateTestCases, invalidCodeLines],
});
