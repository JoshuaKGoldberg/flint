import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";
import htmlLangs from "./rules/htmlLangs.js";

export const jsx = createPlugin({
	name: "jsx",
	rules: [accessKeys, htmlLangs],
});
