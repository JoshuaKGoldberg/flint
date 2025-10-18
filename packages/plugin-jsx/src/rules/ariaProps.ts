import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

// Valid ARIA attributes from WAI-ARIA 1.2 spec
// https://www.w3.org/TR/wai-aria-1.2/#state_prop_def
// cspell:disable -- ARIA attribute names from WAI-ARIA spec
const validAriaProps = new Set([
	"aria-activedescendant",
	"aria-atomic",
	"aria-autocomplete",
	"aria-busy",
	"aria-checked",
	"aria-colcount",
	"aria-colindex",
	"aria-colspan",
	"aria-controls",
	"aria-current",
	"aria-describedby",
	"aria-details",
	"aria-disabled",
	"aria-dropeffect",
	"aria-errormessage",
	"aria-expanded",
	"aria-flowto",
	"aria-grabbed",
	"aria-haspopup",
	"aria-hidden",
	"aria-invalid",
	"aria-keyshortcuts",
	"aria-label",
	"aria-labelledby",
	"aria-level",
	"aria-live",
	"aria-modal",
	"aria-multiline",
	"aria-multiselectable",
	"aria-orientation",
	"aria-owns",
	"aria-placeholder",
	"aria-posinset",
	"aria-pressed",
	"aria-readonly",
	"aria-relevant",
	"aria-required",
	"aria-roledescription",
	"aria-rowcount",
	"aria-rowindex",
	"aria-rowspan",
	"aria-selected",
	"aria-setsize",
	"aria-sort",
	"aria-valuemax",
	"aria-valuemin",
	"aria-valuenow",
	"aria-valuetext",
]);
// cspell:enable

export default typescriptLanguage.createRule({
	about: {
		description: "Reports invalid ARIA properties.",
		id: "ariaProps",
		preset: "logical",
	},
	messages: {
		invalidAriaProp: {
			primary: "Invalid ARIA property: `{{ prop }}`.",
			secondary: [
				"This aria-* attribute is not a valid ARIA property according to the WAI-ARIA spec.",
				"Check the spelling of the property name.",
				"This is required for WCAG 4.1.2 compliance.",
			],
			suggestions: [
				"Check the WAI-ARIA spec for valid property names",
				// cspell:disable-next-line -- Showing common typo
				"Common typos: aria-labeledby (should be aria-labelledby)",
			],
		},
	},
	setup(context) {
		function checkElement(attributes: ts.JsxAttributes) {
			for (const attr of attributes.properties) {
				if (!ts.isJsxAttribute(attr) || !ts.isIdentifier(attr.name)) {
					continue;
				}

				const propName = attr.name.text;
				if (!propName.startsWith("aria-")) {
					continue;
				}

				const lowerPropName = propName.toLowerCase();
				if (!validAriaProps.has(lowerPropName)) {
					context.report({
						data: { prop: propName },
						message: "invalidAriaProp",
						range: getTSNodeRange(attr.name, context.sourceFile),
					});
				}
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkElement(node.attributes);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkElement(node.attributes);
				},
			},
		};
	},
});
