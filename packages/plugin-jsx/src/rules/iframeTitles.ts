import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports <iframe> elements without a title prop.",
		id: "iframeTitles",
		preset: "logical",
	},
	messages: {
		missingTitle: {
			primary: "This <iframe> element is missing a `title` prop.",
			secondary: [
				"The title attribute provides a label for the iframe that describes its content to screen reader users.",
				"Without it, users may have difficulty understanding the purpose of the iframe.",
				"This is required for WCAG 2.4.1 and 4.1.2 compliance.",
			],
			suggestions: [
				'Add a descriptive title prop (e.g., title="Embedded content")',
				"Ensure the title clearly describes the iframe's content",
			],
		},
	},
	setup(context) {
		function checkIframe(
			tagName: ts.JsxTagNameExpression,
			attributes: ts.JsxAttributes,
		) {
			// Only check <iframe> elements
			if (!ts.isIdentifier(tagName)) {
				return;
			}

			if (tagName.text.toLowerCase() !== "iframe") {
				return;
			}

			// Check if title attribute exists and has a non-empty value
			const titleAttr = attributes.properties.find((attr) => {
				if (!ts.isJsxAttribute(attr)) {
					return false;
				}

				return (
					ts.isIdentifier(attr.name) && attr.name.text.toLowerCase() === "title"
				);
			});

			if (!titleAttr || !ts.isJsxAttribute(titleAttr)) {
				context.report({
					message: "missingTitle",
					range: getTSNodeRange(tagName, context.sourceFile),
				});
				return;
			}

			// Check if title has a value
			if (!titleAttr.initializer) {
				context.report({
					message: "missingTitle",
					range: getTSNodeRange(tagName, context.sourceFile),
				});
				return;
			}

			// Check for empty string literals
			if (ts.isStringLiteral(titleAttr.initializer)) {
				if (titleAttr.initializer.text === "") {
					context.report({
						message: "missingTitle",
						range: getTSNodeRange(tagName, context.sourceFile),
					});
				}
			}
			// Check for JSX expressions with empty values
			else if (ts.isJsxExpression(titleAttr.initializer)) {
				const expr = titleAttr.initializer.expression;
				if (!expr) {
					return;
				}

				// Check for empty string, empty template, undefined
				if (
					(ts.isStringLiteral(expr) && expr.text === "") ||
					(ts.isNoSubstitutionTemplateLiteral(expr) && expr.text === "") ||
					(ts.isIdentifier(expr) && expr.text === "undefined")
				) {
					context.report({
						message: "missingTitle",
						range: getTSNodeRange(tagName, context.sourceFile),
					});
				}
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkIframe(node.tagName, node.attributes);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkIframe(node.tagName, node.attributes);
				},
			},
		};
	},
});
