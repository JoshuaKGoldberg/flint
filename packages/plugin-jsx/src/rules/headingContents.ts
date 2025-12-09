import { runtimeBase } from "@flint.fyi/core";
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
			primary: "This heading element is missing accessible content.",
			secondary: [
				"Headings without content are not accessible to screen readers.",
				"Ensure the heading has text content or uses aria-label/aria-labelledby.",
				"This is required for WCAG 2.4.6 compliance.",
			],
			suggestions: [
				"Add text content to the heading",
				"Use aria-label or aria-labelledby to provide accessible text",
			],
		},
	},
	setup(context) {
		function checkHeading(node: ts.JsxElement | ts.JsxSelfClosingElement) {
			const tagName = ts.isJsxElement(node)
				? node.openingElement.tagName
				: node.tagName;

			if (
				!ts.isIdentifier(tagName) ||
				!headingElements.has(tagName.text.toLowerCase())
			) {
				return;
			}

			const attributes = ts.isJsxElement(node)
				? node.openingElement.attributes
				: node.attributes;

			if (
				attributes.properties.some((property) => {
					if (!ts.isJsxAttribute(property) || !ts.isIdentifier(property.name)) {
						return false;
					}

					return (
						(property.name.text === "aria-label" ||
							property.name.text === "aria-labelledby") &&
						!!property.initializer
					);
				})
			) {
				return;
			}

			if (
				ts.isJsxElement(node) &&
				node.children.some((child) => {
					if (ts.isJsxText(child)) {
						return child.text.trim().length > 0;
					}
					return (
						ts.isJsxElement(child) ||
						ts.isJsxSelfClosingElement(child) ||
						ts.isJsxExpression(child)
					);
				})
			) {
				return;
			}

			context.report({
				message: "emptyHeading",
				range: getTSNodeRange(tagName, context.sourceFile),
			});
		}

		return {
			...runtimeBase,
			visitors: {
				JsxElement: checkHeading,
				JsxSelfClosingElement: checkHeading,
			},
		};
	},
});
