import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";
// cspell:disable-next-line -- ariaHiddenFocusables is the rule name
import ariaHiddenFocusables from "./rules/ariaHiddenFocusables.js";

export const jsx = createPlugin({
	name: "jsx",
	// cspell:disable-next-line -- ariaHiddenFocusables is the rule name
	rules: [accessKeys, ariaHiddenFocusables],
});
