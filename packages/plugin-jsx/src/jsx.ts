import { createPlugin } from "@flint.fyi/core";

import accessKeys from "./rules/accessKeys.js";
import altTexts from "./rules/altTexts.js";
import anchorAmbiguousText from "./rules/anchorAmbiguousText.js";
import anchorContent from "./rules/anchorContent.js";
import anchorValidity from "./rules/anchorValidity.js";
import ariaActiveDescendantTabIndex from "./rules/ariaActiveDescendantTabIndex.js";
import ariaHiddenFocusables from "./rules/ariaHiddenFocusables.js";
import ariaProps from "./rules/ariaProps.js";
import ariaPropTypes from "./rules/ariaPropTypes.js";
import ariaRoleValidity from "./rules/ariaRoleValidity.js";
import ariaUnsupportedElements from "./rules/ariaUnsupportedElements.js";
import autocomplete from "./rules/autocomplete.js";
import autoFocusProps from "./rules/autoFocusProps.js";
import booleanValues from "./rules/booleanValues.js";
import bracedStatements from "./rules/bracedStatements.js";
import buttonTypes from "./rules/buttonTypes.js";
import clickEventKeyEvents from "./rules/clickEventKeyEvents.js";
import commentTextNodes from "./rules/commentTextNodes.js";
import distractingElements from "./rules/distractingElements.js";
import headingContents from "./rules/headingContents.js";
import htmlLangs from "./rules/htmlLangs.js";
import iframeTitles from "./rules/iframeTitles.js";
import labelAssociatedControls from "./rules/labelAssociatedControls.js";
import langValidity from "./rules/langValidity.js";
import mediaCaptions from "./rules/mediaCaptions.js";
import mouseEventKeyEvents from "./rules/mouseEventKeyEvents.js";
import nonInteractiveElementInteractions from "./rules/nonInteractiveElementInteractions.js";
import nonInteractiveElementRoles from "./rules/nonInteractiveElementRoles.js";
import nonInteractiveElementTabIndexes from "./rules/nonInteractiveElementTabIndexes.js";
import roleRedundancies from "./rules/roleRedundancies.js";
import roleRequiredAriaProps from "./rules/roleRequiredAriaProps.js";
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
		anchorAmbiguousText,
		anchorContent,
		anchorValidity,
		ariaActiveDescendantTabIndex,
		ariaHiddenFocusables,
		ariaProps,
		ariaPropTypes,
		ariaRoleValidity,
		ariaUnsupportedElements,
		autocomplete,
		autoFocusProps,
		booleanValues,
		bracedStatements,
		buttonTypes,
		clickEventKeyEvents,
		commentTextNodes,
		distractingElements,
		headingContents,
		htmlLangs,
		iframeTitles,
		labelAssociatedControls,
		langValidity,
		mediaCaptions,
		mouseEventKeyEvents,
		nonInteractiveElementInteractions,
		nonInteractiveElementRoles,
		nonInteractiveElementTabIndexes,
		roleRedundancies,
		roleRequiredAriaProps,
		roleSupportedAriaProps,
		roleTags,
		scopeProps,
		staticElementInteractions,
		tabIndexPositiveValues,
	],
});
