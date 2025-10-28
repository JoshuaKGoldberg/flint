import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";
import altTexts from "./rules/altTexts.js";
import anchorContent from "./rules/anchorContent.js";
import anchorValidity from "./rules/anchorValidity.js";
import ariaActiveDescendantTabIndex from "./rules/ariaActiveDescendantTabIndex.js";
import ariaHiddenFocusables from "./rules/ariaHiddenFocusables.js";
import ariaProps from "./rules/ariaProps.js";
import ariaRoleValidity from "./rules/ariaRoleValidity.js";
import ariaUnsupportedElements from "./rules/ariaUnsupportedElements.js";
import autoFocusProps from "./rules/autoFocusProps.js";
import clickEventKeyEvents from "./rules/clickEventKeyEvents.js";
import distractingElements from "./rules/distractingElements.js";
import headingContents from "./rules/headingContents.js";
import htmlLangs from "./rules/htmlLangs.js";
import iframeTitles from "./rules/iframeTitles.js";
import mediaCaptions from "./rules/mediaCaptions.js";
import mouseEventKeyEvents from "./rules/mouseEventKeyEvents.js";
import nonInteractiveElementRoles from "./rules/nonInteractiveElementRoles.js";
import nonInteractiveElementTabIndexes from "./rules/nonInteractiveElementTabIndexes.js";
import roleRedundancies from "./rules/roleRedundancies.js";
import roleSupportedAriaProps from "./rules/roleSupportedAriaProps.js";
import roleTags from "./rules/roleTags.js";
import scopeProps from "./rules/scopeProps.js";
import staticElementInteractions from "./rules/staticElementInteractions.js";
import tabIndexPositiveValues from "./rules/tabIndexPositiveValues.js";

export const jsx = createPlugin({
	name: "jsx",
	rules: [
		accessKeys,
		altTexts,
		anchorContent,
		anchorValidity,
		ariaActiveDescendantTabIndex,
		ariaHiddenFocusables,
		ariaProps,
		ariaRoleValidity,
		ariaUnsupportedElements,
		autoFocusProps,
		clickEventKeyEvents,
		distractingElements,
		headingContents,
		htmlLangs,
		iframeTitles,
		mediaCaptions,
		mouseEventKeyEvents,
		nonInteractiveElementRoles,
		nonInteractiveElementTabIndexes,
		roleRedundancies,
		roleSupportedAriaProps,
		roleTags,
		scopeProps,
		staticElementInteractions,
		tabIndexPositiveValues,
	],
});
