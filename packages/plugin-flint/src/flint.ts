import { createPlugin } from "@flint.fyi/core";

import duplicateTestCases from "./rules/duplicateTestCases.js";

export const flint = createPlugin({
	name: "flint",
	rules: [duplicateTestCases],
});
