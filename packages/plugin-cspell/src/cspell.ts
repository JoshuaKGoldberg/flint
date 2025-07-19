import { createPlugin } from "@flint.fyi/core";

import spelling from "./rules/spelling.js";

export const cspell = createPlugin({
	name: "cspell",
	rules: [spelling],
});
