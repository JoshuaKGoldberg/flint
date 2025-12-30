import { createPlugin } from "@flint.fyi/core";

import cspell from "./rules/cspell.js";

export const spelling = createPlugin({
	name: "Spelling",
	rules: [cspell],
});
