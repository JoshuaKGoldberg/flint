import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

// cspell:disable -- activedescendant is correct spelling
// Elements that are inherently tabbable
const inherentlyTabbableElements = new Set([
	"a",
	"area",
	"button",
	"input",
	"select",
	"textarea",
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports elements with aria-activedescendant without tabIndex.",
		id: "ariaActiveDescendantTabIndex",
		preset: "logical",
	},
	messages: {
		missingTabIndex: {
			primary:
				"Elements with `aria-activedescendant` must have a `tabIndex` attribute.",
			secondary: [
				"aria-activedescendant is used to manage focus within a composite widget.",
				"The element must be tabbable, either with an inherent tabIndex or explicit tabIndex attribute.",
				"Without it, keyboard users cannot reach the element.",
			],
			suggestions: [
				'Add tabIndex="0" to make the element tabbable',
				'Add tabIndex="-1" to make it programmatically focusable',
			],
		},
	},
	setup(context) {
		function checkElement(
			tagName: ts.JsxTagNameExpression,
			attributes: ts.JsxAttributes,
		) {
			// Skip custom components (start with uppercase)
			if (ts.isIdentifier(tagName)) {
				const firstChar = tagName.text.charAt(0);
				if (
					firstChar === firstChar.toUpperCase() &&
					firstChar !== firstChar.toLowerCase()
				) {
					return;
				}
			}

			// Check if element has aria-activedescendant
			const hasAriaActiveDescendant = attributes.properties.some(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "aria-activedescendant" &&
					attr.initializer,
			);

			if (!hasAriaActiveDescendant) {
				return;
			}

			// Check if it's an inherently tabbable element
			if (ts.isIdentifier(tagName)) {
				const elementName = tagName.text.toLowerCase();
				if (inherentlyTabbableElements.has(elementName)) {
					return;
				}
			}

			// Check if element has explicit tabIndex
			const hasTabIndex = attributes.properties.some(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text.toLowerCase() === "tabindex",
			);

			if (!hasTabIndex) {
				// Find the aria-activedescendant attribute to report on
				const ariaAttr = attributes.properties.find(
					(attr) =>
						ts.isJsxAttribute(attr) &&
						ts.isIdentifier(attr.name) &&
						attr.name.text === "aria-activedescendant",
				);

				if (ariaAttr && ts.isJsxAttribute(ariaAttr)) {
					context.report({
						message: "missingTabIndex",
						range: getTSNodeRange(ariaAttr, context.sourceFile),
					});
				}
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkElement(node.tagName, node.attributes);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkElement(node.tagName, node.attributes);
				},
			},
		};
	},
});
