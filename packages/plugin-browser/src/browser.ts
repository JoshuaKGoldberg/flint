import { createPlugin } from "@flint.fyi/core";

import alerts from "./rules/alerts.js";
import documentCookies from "./rules/documentCookies.js";
import eventListenerSubscriptions from "./rules/eventListenerSubscriptions.js";
import implicitGlobals from "./rules/implicitGlobals.js";
import keyboardEventKeys from "./rules/keyboardEventKeys.js";
import scriptUrls from "./rules/scriptUrls.js";

export const browser = createPlugin({
	name: "browser",
	rules: [
		alerts,
		documentCookies,
		eventListenerSubscriptions,
		implicitGlobals,
		keyboardEventKeys,
		scriptUrls,
		scriptUrls,
	],
});
