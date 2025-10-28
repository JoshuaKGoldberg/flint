import { createPlugin } from "@flint.fyi/core";

import alerts from "./rules/alerts.js";
import implicitGlobals from "./rules/implicitGlobals.js";
import scriptUrls from "./rules/scriptUrls.js";

export const browser = createPlugin({
	name: "browser",
	rules: [alerts, implicitGlobals, scriptUrls],
});
