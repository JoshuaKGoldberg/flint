import { createPlugin } from "@flint.fyi/core";

import alerts from "./rules/alerts.js";
import documentCookies from "./rules/documentCookies.js";
import scriptUrls from "./rules/scriptUrls.js";

export const browser = createPlugin({
	name: "browser",
	rules: [alerts, documentCookies, scriptUrls],
});
