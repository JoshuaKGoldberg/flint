import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";
import iframeTitles from "./rules/iframeTitles.js";

export const jsx = createPlugin({
	name: "jsx",
	rules: [accessKeys, iframeTitles],
});
