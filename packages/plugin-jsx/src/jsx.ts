import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";
import ariaProps from "./rules/ariaProps.js";

export const jsx = createPlugin({
	name: "jsx",
	rules: [accessKeys, ariaProps],
});
