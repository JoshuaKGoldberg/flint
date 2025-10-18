import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";
import autoFocusProps from "./rules/autoFocusProps.js";

export const jsx = createPlugin({
	name: "jsx",
	rules: [accessKeys, autoFocusProps],
});
