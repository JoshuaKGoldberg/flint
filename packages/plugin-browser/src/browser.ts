import { createPlugin } from "@flint.fyi/core";

import alerts from "./rules/alerts.js";
import classListToggles from "./rules/classListToggles.js";
import documentCookies from "./rules/documentCookies.js";
import eventListenerSubscriptions from "./rules/eventListenerSubscriptions.js";
import implicitGlobals from "./rules/implicitGlobals.js";
import keyboardEventKeys from "./rules/keyboardEventKeys.js";
import nodeAppendMethods from "./rules/nodeAppendMethods.js";
import nodeDatasetAttributes from "./rules/nodeDatasetAttributes.js";
import nodeModificationMethods from "./rules/nodeModificationMethods.js";
import nodeQueryMethods from "./rules/nodeQueryMethods.js";
import nodeRemoveMethods from "./rules/nodeRemoveMethods.js";
import scriptUrls from "./rules/scriptUrls.js";

export const browser = createPlugin({
	name: "browser",
	rules: [
		alerts,
		classListToggles,
		documentCookies,
		eventListenerSubscriptions,
		implicitGlobals,
		keyboardEventKeys,
		nodeAppendMethods,
		nodeDatasetAttributes,
		nodeModificationMethods,
		nodeQueryMethods,
		nodeRemoveMethods,
		scriptUrls,
	],
});
