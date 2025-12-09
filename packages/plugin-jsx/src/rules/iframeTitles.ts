import { runtimeBase } from "@flint.fyi/core";
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
			if (
				!ts.isIdentifier(tagName) ||
				tagName.text.toLowerCase() !== "iframe"
			) {
				return;
			}

			const titleAttribute = attributes.properties.find((property) => {
				return (
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text.toLowerCase() === "title"
				);
			});

			if (!titleAttribute || !ts.isJsxAttribute(titleAttribute)) {
				context.report({
					message: "missingTitle",
					range: getTSNodeRange(tagName, context.sourceFile),
				});
				return;
			}

			if (!titleAttribute.initializer) {
				context.report({
					message: "missingTitle",
					range: getTSNodeRange(tagName, context.sourceFile),
				});
				return;
			}

			if (ts.isStringLiteral(titleAttribute.initializer)) {
				if (titleAttribute.initializer.text === "") {
					context.report({
						message: "missingTitle",
						range: getTSNodeRange(tagName, context.sourceFile),
					});
				}
			} else if (ts.isJsxExpression(titleAttribute.initializer)) {
				const { expression } = titleAttribute.initializer;
				if (!expression) {
					return;
				}

				if (
					(ts.isStringLiteral(expression) && expression.text === "") ||
					(ts.isNoSubstitutionTemplateLiteral(expression) &&
						expression.text === "") ||
					(ts.isIdentifier(expression) && expression.text === "undefined")
				) {
					context.report({
						message: "missingTitle",
						range: getTSNodeRange(tagName, context.sourceFile),
					});
				}
			}
		}

		return {
			...runtimeBase,
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
