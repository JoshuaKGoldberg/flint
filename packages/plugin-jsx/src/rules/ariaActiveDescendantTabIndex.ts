import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

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
				"This element with `aria-activedescendant` is missing a `tabIndex` attribute to manage focus state.",
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
			if (ts.isIdentifier(tagName)) {
				const firstCharacter = tagName.text.charAt(0);
				if (
					firstCharacter === firstCharacter.toUpperCase() &&
					firstCharacter !== firstCharacter.toLowerCase()
				) {
					return;
				}
			}

			if (
				!attributes.properties.some(
					(property) =>
						ts.isJsxAttribute(property) &&
						ts.isIdentifier(property.name) &&
						property.name.text === "aria-activedescendant" &&
						property.initializer,
				)
			) {
				return;
			}

			if (ts.isIdentifier(tagName)) {
				if (inherentlyTabbableElements.has(tagName.text.toLowerCase())) {
					return;
				}
			}

			const hasTabIndex = attributes.properties.some(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text.toLowerCase() === "tabindex",
			);

			if (!hasTabIndex) {
				const ariaProperty = attributes.properties.find(
					(property) =>
						ts.isJsxAttribute(property) &&
						ts.isIdentifier(property.name) &&
						property.name.text === "aria-activedescendant",
				);

				if (ariaProperty && ts.isJsxAttribute(ariaProperty)) {
					context.report({
						message: "missingTabIndex",
						range: getTSNodeRange(ariaProperty, context.sourceFile),
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
