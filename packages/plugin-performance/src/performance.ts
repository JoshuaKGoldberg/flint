import { createPlugin } from "@flint.fyi/core";

import loopAwaits from "./rules/loopAwaits.js";
import spreadAccumulators from "./rules/spreadAccumulators.js";

export const performance = createPlugin({
	name: "performance",
	rules: [loopAwaits, spreadAccumulators],
});
