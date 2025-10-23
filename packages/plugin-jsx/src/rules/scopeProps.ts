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
			primary: "The `scope` prop only has an effect on <th> elements.",
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
		function checkElement(node: ts.JsxOpeningLikeElement) {
			if (
				!ts.isIdentifier(node.tagName) ||
				node.tagName.text.toLowerCase() === "th"
			) {
				return;
			}

			const scopeProperty = node.attributes.properties.find((property) => {
				return (
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text.toLowerCase() === "scope"
				);
			});

			if (!scopeProperty) {
				return;
			}

			context.report({
				message: "invalidScope",
				range: getTSNodeRange(scopeProperty, context.sourceFile),
			});
		}

		return {
			visitors: {
				JsxOpeningElement: checkElement,
				JsxSelfClosingElement: checkElement,
			},
		};
	},
});
