import { createPlugin } from "@flint.fyi/core";

import alerts from "./rules/alerts.js";
import nodeTextContents from "./rules/nodeTextContents.js";
import scriptUrls from "./rules/scriptUrls.js";

export const browser = createPlugin({
	name: "browser",
	rules: [alerts, nodeTextContents, scriptUrls],
});
