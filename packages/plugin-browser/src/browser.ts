import { createPlugin } from "@flint.fyi/core";

import alerts from "./rules/alerts.js";
import nodeRemoveMethods from "./rules/nodeRemoveMethods.js";
import scriptUrls from "./rules/scriptUrls.js";

export const browser = createPlugin({
	name: "browser",
	rules: [alerts, nodeRemoveMethods, scriptUrls],
});
