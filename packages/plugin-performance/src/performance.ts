import { createPlugin } from "@flint.fyi/core";

import loopAwaits from "./rules/loopAwaits.js";

export const performance = createPlugin({
	name: "performance",
	rules: [loopAwaits],
});
