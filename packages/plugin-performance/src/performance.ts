import { createPlugin } from "@flint.fyi/core";

import loopAwaits from "./rules/loopAwaits.js";

export const browser = createPlugin({
	name: "browser",
	rules: [loopAwaits],
});
