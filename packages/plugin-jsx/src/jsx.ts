import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";
import tabIndexPositiveValues from "./rules/tabIndexPositiveValues.js";

export const jsx = createPlugin({
	name: "jsx",
	rules: [accessKeys, tabIndexPositiveValues],
});
