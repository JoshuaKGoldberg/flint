import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";
import altTexts from "./rules/altTexts.js";
import ariaActiveDescendantTabIndex from "./rules/ariaActiveDescendantTabIndex.js";
import ariaHiddenFocusables from "./rules/ariaHiddenFocusables.js";
import ariaProps from "./rules/ariaProps.js";
import ariaRoles from "./rules/ariaRoles.js";
import ariaUnsupportedElements from "./rules/ariaUnsupportedElements.js";
import autoFocusProps from "./rules/autoFocusProps.js";
import distractingElements from "./rules/distractingElements.js";
import headingContents from "./rules/headingContents.js";
import htmlLangs from "./rules/htmlLangs.js";
import iframeTitles from "./rules/iframeTitles.js";
import mediaCaptions from "./rules/mediaCaptions.js";
import mouseEventKeyEvents from "./rules/mouseEventKeyEvents.js";
import scopeProps from "./rules/scopeProps.js";
import tabIndexPositiveValues from "./rules/tabIndexPositiveValues.js";

export const jsx = createPlugin({
	name: "jsx",
	rules: [
		accessKeys,
		altTexts,
		ariaActiveDescendantTabIndex,
		ariaHiddenFocusables,
		ariaProps,
		ariaRoles,
		ariaUnsupportedElements,
		autoFocusProps,
		distractingElements,
		headingContents,
		htmlLangs,
		iframeTitles,
		mediaCaptions,
		mouseEventKeyEvents,
		scopeProps,
		tabIndexPositiveValues,
	],
});
