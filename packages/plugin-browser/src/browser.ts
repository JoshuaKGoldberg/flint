import { createPlugin } from "@flint.fyi/core";

import alerts from "./rules/alerts.js";
import eventListenerSubscriptions from "./rules/eventListenerSubscriptions.js";
import scriptUrls from "./rules/scriptUrls.js";

export const browser = createPlugin({
	name: "browser",
	rules: [alerts, eventListenerSubscriptions, scriptUrls],
});
