import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports scope props on non-th elements.",
		id: "scopeProps",
		preset: "logical",
	},
	messages: {
		invalidScope: {
			primary: "The `scope` prop should only be used on <th> elements.",
			secondary: [
				"The scope attribute defines whether a table header is a column header or row header.",
				"Using it on non-<th> elements has no semantic meaning and may confuse assistive technologies.",
				"This is required for WCAG 1.3.1 and 4.1.1 compliance.",
			],
			suggestions: [
				"Remove the scope prop from this element",
				"Change this element to a <th> element if it's a table header",
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

			// Check if element has a scope attribute
			const scopeAttr = attributes.properties.find((attr) => {
				if (!ts.isJsxAttribute(attr)) {
					return false;
				}

				return (
					ts.isIdentifier(attr.name) && attr.name.text.toLowerCase() === "scope"
				);
			});

			if (!scopeAttr) {
				return;
			}

			// Report if element is not a th
			const elementName = tagName.text.toLowerCase();
			if (elementName !== "th") {
				context.report({
					message: "invalidScope",
					range: getTSNodeRange(scopeAttr, context.sourceFile),
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
