import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const headingElements = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

export default typescriptLanguage.createRule({
	about: {
		description: "Reports heading elements without accessible content.",
		id: "headingContents",
		preset: "logical",
	},
	messages: {
		emptyHeading: {
			primary: "Heading elements must have accessible content.",
			secondary: [
				"Headings without content are not accessible to screen readers.",
				// cspell:disable-next-line -- aria-labelledby is correct spelling
				"Ensure the heading has text content or uses aria-label/aria-labelledby.",
				"This is required for WCAG 2.4.6 compliance.",
			],
			suggestions: [
				"Add text content to the heading",
				// cspell:disable-next-line -- aria-labelledby is correct spelling
				"Use aria-label or aria-labelledby to provide accessible text",
				"Use dangerouslySetInnerHTML if the content is dynamic",
			],
		},
	},
	setup(context) {
		function checkHeading(node: ts.JsxElement | ts.JsxSelfClosingElement) {
			const tagName = ts.isJsxElement(node)
				? node.openingElement.tagName
				: node.tagName;

			if (!ts.isIdentifier(tagName)) {
				return;
			}

			const elementName = tagName.text.toLowerCase();
			if (!headingElements.has(elementName)) {
				return;
			}

			const attributes = ts.isJsxElement(node)
				? node.openingElement.attributes
				: node.attributes;

			// Check for dangerouslySetInnerHTML
			const hasDangerousHTML = attributes.properties.some(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "dangerouslySetInnerHTML",
			);

			if (hasDangerousHTML) {
				return;
			}

			// cspell:disable -- aria-labelledby is correct spelling
			// Check for aria-label or aria-labelledby
			const hasAriaLabel = attributes.properties.some((attr) => {
				if (!ts.isJsxAttribute(attr) || !ts.isIdentifier(attr.name)) {
					return false;
				}
				return (
					(attr.name.text === "aria-label" ||
						attr.name.text === "aria-labelledby") &&
					!!attr.initializer
				);
			});
			// cspell:enable

			if (hasAriaLabel) {
				return;
			}

			// Check if heading has children
			if (ts.isJsxElement(node)) {
				// Filter out children that are just whitespace
				const hasNonWhitespaceChildren = node.children.some((child) => {
					if (ts.isJsxText(child)) {
						return child.text.trim().length > 0;
					}
					// Any other child type (elements, expressions) counts as content
					return (
						ts.isJsxElement(child) ||
						ts.isJsxSelfClosingElement(child) ||
						ts.isJsxExpression(child)
					);
				});

				if (hasNonWhitespaceChildren) {
					return;
				}
			}

			// Self-closing or empty heading
			context.report({
				message: "emptyHeading",
				range: getTSNodeRange(tagName, context.sourceFile),
			});
		}

		return {
			visitors: {
				JsxElement(node: ts.JsxElement) {
					checkHeading(node);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkHeading(node);
				},
			},
		};
	},
});
