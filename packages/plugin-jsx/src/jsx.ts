import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";
import distractingElements from "./rules/distractingElements.js";
import htmlLangs from "./rules/htmlLangs.js";
import iframeTitles from "./rules/iframeTitles.js";
import mouseEventKeyEvents from "./rules/mouseEventKeyEvents.js";

export const jsx = createPlugin({
	name: "jsx",
	rules: [
		accessKeys,
		distractingElements,
		htmlLangs,
		iframeTitles,
		mouseEventKeyEvents,
	],
});
