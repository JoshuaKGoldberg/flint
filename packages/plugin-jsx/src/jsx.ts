import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";
import scopeProps from "./rules/scopeProps.js";

export const jsx = createPlugin({
	name: "jsx",
	rules: [accessKeys, scopeProps],
});
