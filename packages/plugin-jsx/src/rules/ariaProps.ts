import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

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
			suggestions: ["Use a valid property from the WAI-ARIA specification."],
		},
	},
	setup(context) {
		function checkElement(node: ts.JsxOpeningLikeElement) {
			for (const property of node.attributes.properties) {
				if (!ts.isJsxAttribute(property) || !ts.isIdentifier(property.name)) {
					continue;
				}

				const propertyName = property.name.text;
				if (!propertyName.startsWith("aria-")) {
					continue;
				}

				if (!validAriaProps.has(propertyName.toLowerCase())) {
					context.report({
						data: { prop: propertyName },
						message: "invalidAriaProp",
						range: getTSNodeRange(property.name, context.sourceFile),
					});
				}
			}
		}

		return {
			visitors: {
				JsxOpeningElement: checkElement,
				JsxSelfClosingElement: checkElement,
			},
		};
	},
});
