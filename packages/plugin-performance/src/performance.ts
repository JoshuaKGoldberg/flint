import { createPlugin } from "@flint.fyi/core";

import importedNamespaceDynamicAccesses from "./rules/importedNamespaceDynamicAccesses.js";
import loopAwaits from "./rules/loopAwaits.js";

export const performance = createPlugin({
	name: "performance",
	rules: [importedNamespaceDynamicAccesses, loopAwaits],
});
