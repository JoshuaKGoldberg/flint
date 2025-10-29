import { createPlugin } from "@flint.fyi/core";

import deletes from "./rules/deletes.js";
import loopAwaits from "./rules/loopAwaits.js";

export const performance = createPlugin({
	name: "performance",
	rules: [deletes, loopAwaits],
});
