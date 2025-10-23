import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";
import altTexts from "./rules/altTexts.js";
import ariaActiveDescendantTabIndex from "./rules/ariaActiveDescendantTabIndex.js";
import distractingElements from "./rules/distractingElements.js";
import htmlLangs from "./rules/htmlLangs.js";
import iframeTitles from "./rules/iframeTitles.js";
import mediaCaptions from "./rules/mediaCaptions.js";
import mouseEventKeyEvents from "./rules/mouseEventKeyEvents.js";

export const jsx = createPlugin({
	name: "jsx",
	rules: [
		accessKeys,
		altTexts,
		ariaActiveDescendantTabIndex,
		distractingElements,
		htmlLangs,
		iframeTitles,
		mediaCaptions,
		mouseEventKeyEvents,
	],
});
