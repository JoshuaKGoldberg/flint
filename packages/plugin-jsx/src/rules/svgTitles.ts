import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports <svg> elements without a <title> child element.",
		id: "svgTitles",
		preset: "logical",
	},
	messages: {
		missingTitle: {
			primary: "This <svg> element is missing a <title> child element.",
			secondary: [
				"SVG elements without a title are not accessible to screen readers.",
				"The <title> element provides a text description of the SVG's content.",
				"This is required for WCAG 1.1.1 compliance.",
			],
			suggestions: [
				"Add a <title> child element with descriptive text",
				"Use aria-label or aria-labelledby as an alternative",
			],
		},
	},
	setup(context) {
		function checkSvgElement(node: ts.JsxElement | ts.JsxSelfClosingElement) {
			const tagName = ts.isJsxElement(node)
				? node.openingElement.tagName
				: node.tagName;

			if (!ts.isIdentifier(tagName) || tagName.text.toLowerCase() !== "svg") {
				return;
			}

			const attributes = ts.isJsxElement(node)
				? node.openingElement.attributes
				: node.attributes;

			if (
				attributes.properties.some(
					(property) =>
						ts.isJsxAttribute(property) &&
						ts.isIdentifier(property.name) &&
						(property.name.text === "aria-label" ||
							property.name.text === "aria-labelledby") &&
						property.initializer,
				)
			) {
				return;
			}

			if (ts.isJsxElement(node) && node.children.some(isTitleElement)) {
				return;
			}

			context.report({
				message: "missingTitle",
				range: getTSNodeRange(tagName, context.sourceFile),
			});
		}

		return {
			visitors: {
				JsxElement(node: ts.JsxElement) {
					checkSvgElement(node);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkSvgElement(node);
				},
			},
		};
	},
});

function isTitleElement(node: ts.Node) {
	if (!ts.isJsxElement(node) && !ts.isJsxSelfClosingElement(node)) {
		return false;
	}

	const childTagName = ts.isJsxElement(node)
		? node.openingElement.tagName
		: node.tagName;

	return ts.isIdentifier(childTagName) && childTagName.text === "title";
}
