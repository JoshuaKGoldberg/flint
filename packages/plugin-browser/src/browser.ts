import { createPlugin } from "@flint.fyi/core";

import alerts from "./rules/alerts.js";
import nodeAppendMethods from "./rules/nodeAppendMethods.js";
import scriptUrls from "./rules/scriptUrls.js";

export const browser = createPlugin({
	name: "browser",
	rules: [alerts, nodeAppendMethods, scriptUrls],
});
