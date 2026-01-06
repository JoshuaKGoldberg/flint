import { type AST, getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports anchor elements without accessible content.",
		id: "anchorContent",
		preset: "logical",
	},
	messages: {
		missingContent: {
			primary: "This anchor element is missing accessible content.",
			secondary: [
				"Non-visual tools such as screen readers and search engine crawlers need content to describe links.",
				"Provide text content, aria-label, aria-labelledby, or title attribute.",
				"This is required for WCAG 2.4.4 and 4.1.2 compliance.",
			],
			suggestions: [
				"Add text content inside the anchor",
				"Add an aria-label attribute",
				"Add a title attribute",
			],
		},
	},
	setup(context) {
		function hasAccessibleContent(
			element: AST.JsxOpeningElement | AST.JsxSelfClosingElement,
		): boolean {
			return element.attributes.properties.some(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					(property.name.text === "aria-label" ||
						property.name.text === "aria-labelledby" ||
						property.name.text === "title") &&
					property.initializer,
			);
		}

		function hasTextContent(element: AST.JsxElement) {
			return element.children.some((child) => {
				if (ts.isJsxText(child) && child.text.trim()) {
					return true;
				}

				if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) {
					const childElement = ts.isJsxElement(child)
						? child.openingElement
						: child;

					if (
						!childElement.attributes.properties.some(
							(attr) =>
								ts.isJsxAttribute(attr) &&
								ts.isIdentifier(attr.name) &&
								attr.name.text === "aria-hidden",
						)
					) {
						return true;
					}
				}

				if (ts.isJsxExpression(child) && child.expression) {
					return true;
				}
			});
		}

		return {
			visitors: {
				JsxElement(node, { sourceFile }) {
					const openingElement = node.openingElement;
					if (
						ts.isIdentifier(openingElement.tagName) &&
						openingElement.tagName.text === "a" &&
						!hasAccessibleContent(openingElement) &&
						!hasTextContent(node)
					) {
						context.report({
							message: "missingContent",
							range: getTSNodeRange(openingElement, sourceFile),
						});
					}
				},
				JsxSelfClosingElement(node, { sourceFile }) {
					if (
						ts.isIdentifier(node.tagName) &&
						node.tagName.text === "a" &&
						!hasAccessibleContent(node)
					) {
						context.report({
							message: "missingContent",
							range: getTSNodeRange(node, sourceFile),
						});
					}
				},
			},
		};
	},
});
