import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

// cspell:disable -- aria-labelledby is correct spelling

export default typescriptLanguage.createRule({
	about: {
		description: "Reports anchor elements without accessible content.",
		id: "anchorContent",
		preset: "logical",
	},
	messages: {
		missingContent: {
			primary: "Anchor elements must have accessible content.",
			secondary: [
				"Screen readers need content to describe links.",
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
			element: ts.JsxOpeningElement | ts.JsxSelfClosingElement,
		): boolean {
			const attributes = element.attributes;

			// Check for aria-label
			const hasAriaLabel = attributes.properties.some(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					(attr.name.text === "aria-label" ||
						attr.name.text === "aria-labelledby") &&
					attr.initializer,
			);

			if (hasAriaLabel) {
				return true;
			}

			// Check for title attribute
			const hasTitle = attributes.properties.some(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "title" &&
					attr.initializer,
			);

			if (hasTitle) {
				return true;
			}

			// Check for dangerouslySetInnerHTML
			const hasDangerousHTML = attributes.properties.some(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "dangerouslySetInnerHTML",
			);

			if (hasDangerousHTML) {
				return true;
			}

			return false;
		}

		function hasTextContent(element: ts.JsxElement): boolean {
			// Check if there are any children
			if (element.children.length === 0) {
				return false;
			}

			// Check for non-aria-hidden children
			for (const child of element.children) {
				// Text nodes count as content
				if (ts.isJsxText(child) && child.text.trim()) {
					return true;
				}

				// JSX elements that aren't aria-hidden count as content
				if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) {
					const childElement = ts.isJsxElement(child)
						? child.openingElement
						: child;

					const isAriaHidden = childElement.attributes.properties.some(
						(attr) =>
							ts.isJsxAttribute(attr) &&
							ts.isIdentifier(attr.name) &&
							attr.name.text === "aria-hidden",
					);

					if (!isAriaHidden) {
						return true;
					}
				}

				// Expressions could contain content
				if (ts.isJsxExpression(child) && child.expression) {
					return true;
				}
			}

			return false;
		}

		return {
			visitors: {
				JsxElement(node: ts.JsxElement) {
					const openingElement = node.openingElement;
					if (
						!ts.isIdentifier(openingElement.tagName) ||
						openingElement.tagName.text !== "a"
					) {
						return;
					}

					const hasAccessible = hasAccessibleContent(openingElement);
					const hasText = hasTextContent(node);

					if (!hasAccessible && !hasText) {
						context.report({
							message: "missingContent",
							range: getTSNodeRange(openingElement, context.sourceFile),
						});
					}
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					if (!ts.isIdentifier(node.tagName) || node.tagName.text !== "a") {
						return;
					}

					if (!hasAccessibleContent(node)) {
						context.report({
							message: "missingContent",
							range: getTSNodeRange(node, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
