import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

// cspell:disable -- aria-labelledby is correct spelling
export default typescriptLanguage.createRule({
	about: {
		description: "Reports elements that require alt text but are missing it.",
		id: "altText",
		preset: "logical",
	},
	messages: {
		missingAlt: {
			primary: "{{ element }} elements must have an alt attribute.",
			secondary: [
				"Alternative text provides a textual description for images and other media.",
				"Screen readers use this text to describe the element to users who cannot see it.",
				"This is required for WCAG 1.1.1 compliance.",
			],
			suggestions: [
				"Add an alt attribute with descriptive text",
				'Use alt="" for decorative images',
				"Use aria-label or aria-labelledby for alternative labeling",
			],
		},
	},
	setup(context) {
		function checkElement(
			tagName: ts.JsxTagNameExpression,
			attributes: ts.JsxAttributes,
		) {
			if (!ts.isIdentifier(tagName)) {
				return;
			}

			const elementName = tagName.text.toLowerCase();

			// Check img, area, and input[type="image"]
			if (elementName === "img" || elementName === "area") {
				checkAltAttribute(tagName, attributes, elementName);
			} else if (elementName === "input") {
				// Check if it's type="image"
				const typeAttr = attributes.properties.find(
					(attr) =>
						ts.isJsxAttribute(attr) &&
						ts.isIdentifier(attr.name) &&
						attr.name.text === "type",
				);

				if (typeAttr && ts.isJsxAttribute(typeAttr)) {
					if (
						typeAttr.initializer &&
						ts.isStringLiteral(typeAttr.initializer) &&
						typeAttr.initializer.text === "image"
					) {
						checkAltAttribute(tagName, attributes, "input[type='image']");
					}
				}
			} else if (elementName === "object") {
				checkObjectAccessibility(tagName, attributes);
			}
		}

		function checkAltAttribute(
			tagName: ts.JsxTagNameExpression,
			attributes: ts.JsxAttributes,
			elementName: string,
		) {
			// Check if element has alt attribute
			const altAttr = attributes.properties.find(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "alt",
			);

			// Also check for aria-label or aria-labelledby as alternatives
			const hasAriaLabel = attributes.properties.some(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					(attr.name.text === "aria-label" ||
						attr.name.text === "aria-labelledby") &&
					attr.initializer,
			);

			if (hasAriaLabel) {
				return; // aria-label/labelledby is acceptable
			}

			if (!altAttr) {
				context.report({
					data: { element: elementName },
					message: "missingAlt",
					range: getTSNodeRange(tagName, context.sourceFile),
				});
				return;
			}

			// Check if alt has a value (not undefined or empty expression)
			if (ts.isJsxAttribute(altAttr)) {
				if (!altAttr.initializer) {
					// alt with no value (just `alt`)
					context.report({
						data: { element: elementName },
						message: "missingAlt",
						range: getTSNodeRange(tagName, context.sourceFile),
					});
				} else if (ts.isJsxExpression(altAttr.initializer)) {
					const expr = altAttr.initializer.expression;
					// Check for undefined
					if (expr && ts.isIdentifier(expr) && expr.text === "undefined") {
						context.report({
							data: { element: elementName },
							message: "missingAlt",
							range: getTSNodeRange(tagName, context.sourceFile),
						});
					}
				}
			}
		}

		function checkObjectAccessibility(
			tagName: ts.JsxTagNameExpression,
			attributes: ts.JsxAttributes,
		) {
			// object needs aria-label, aria-labelledby, title, or meaningful children
			const hasLabel = attributes.properties.some(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					(attr.name.text === "aria-label" ||
						attr.name.text === "aria-labelledby" ||
						attr.name.text === "title") &&
					attr.initializer,
			);

			if (!hasLabel) {
				context.report({
					data: { element: "object" },
					message: "missingAlt",
					range: getTSNodeRange(tagName, context.sourceFile),
				});
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
