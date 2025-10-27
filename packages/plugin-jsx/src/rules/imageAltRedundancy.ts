import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const redundantWords = ["image", "photo", "picture"];

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports img alt text containing redundant words like 'image' or 'photo'.",
		id: "imageAltRedundancy",
		preset: "logical",
	},
	messages: {
		redundantAlt: {
			primary:
				"Alt text should not contain the word '{{ word }}'. Screen readers already announce images as images.",
			secondary: [
				"Words like 'image', 'photo', and 'picture' are redundant in alt text.",
				"Screen readers already identify the element as an image.",
				"Focus on describing the content of the image instead.",
			],
			suggestions: [
				"Remove redundant words from the alt text",
				"Describe what the image shows instead",
			],
		},
	},
	setup(context) {
		function checkImageAlt(
			tagName: ts.JsxTagNameExpression,
			attributes: ts.JsxAttributes,
		) {
			if (!ts.isIdentifier(tagName) || tagName.text !== "img") {
				return;
			}

			// Check if image is hidden with aria-hidden
			const ariaHidden = attributes.properties.find(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "aria-hidden",
			);

			if (ariaHidden && ts.isJsxAttribute(ariaHidden)) {
				// If aria-hidden is present and true, skip validation
				if (!ariaHidden.initializer) {
					// aria-hidden with no value defaults to true
					return;
				}

				if (ts.isStringLiteral(ariaHidden.initializer)) {
					// aria-hidden="true"
					if (ariaHidden.initializer.text === "true") {
						return;
					}
				} else if (
					ts.isJsxExpression(ariaHidden.initializer) &&
					ariaHidden.initializer.expression
				) {
					const expr = ariaHidden.initializer.expression;
					if (
						expr.kind === ts.SyntaxKind.TrueKeyword ||
						(ts.isIdentifier(expr) && expr.text === "true")
					) {
						return;
					}
				}
			}

			// Find alt attribute
			const altAttr = attributes.properties.find(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "alt",
			);

			if (!altAttr || !ts.isJsxAttribute(altAttr)) {
				return;
			}

			// Check the alt value
			if (altAttr.initializer && ts.isStringLiteral(altAttr.initializer)) {
				const altText = altAttr.initializer.text.toLowerCase();

				for (const word of redundantWords) {
					// Use word boundary regex to match whole words
					const regex = new RegExp(`\\b${word}\\b`, "i");
					if (regex.test(altText)) {
						context.report({
							data: { word },
							message: "redundantAlt",
							range: getTSNodeRange(altAttr, context.sourceFile),
						});
						break; // Report only once per alt attribute
					}
				}
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkImageAlt(node.tagName, node.attributes);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkImageAlt(node.tagName, node.attributes);
				},
			},
		};
	},
});
