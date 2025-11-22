import { createPlugin } from "@flint.fyi/core";

import deletes from "./rules/deletes.js";
import importedNamespaceDynamicAccesses from "./rules/importedNamespaceDynamicAccesses.js";
import loopAwaits from "./rules/loopAwaits.js";
import loopFunctions from "./rules/loopFunctions.js";
import spreadAccumulators from "./rules/spreadAccumulators.js";

export const performance = createPlugin({
	name: "Performance",
	rules: [
		deletes,
		importedNamespaceDynamicAccesses,
		loopAwaits,
		loopFunctions,
		spreadAccumulators,
	],
});
