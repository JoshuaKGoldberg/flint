import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";

export const jsx = createPlugin({
	name: "jsx",
	rules: [accessKeys],
});
