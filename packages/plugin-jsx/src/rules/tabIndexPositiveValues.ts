import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports positive tabIndex values.",
		id: "tabIndexPositiveValues",
		preset: "logical",
	},
	messages: {
		noPositiveTabIndex: {
			primary: "Avoid positive `tabIndex` values.",
			secondary: [
				"Positive tabIndex values disrupt the natural tab order and make keyboard navigation unpredictable.",
				'Use tabIndex="0" to include elements in the natural tab order, or tabIndex="-1" to make them programmatically focusable.',
				"This is required for WCAG 2.4.3 compliance.",
			],
			suggestions: [
				'Use tabIndex="0" for elements that should be in the tab order',
				'Use tabIndex="-1" for elements that should be programmatically focusable',
				"Remove tabIndex to use the default tab order",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				JsxAttribute(node: ts.JsxAttribute) {
					if (!ts.isIdentifier(node.name)) {
						return;
					}

					if (node.name.text.toLowerCase() !== "tabindex") {
						return;
					}

					if (!node.initializer) {
						return;
					}

					let value: number | undefined;

					// Handle string literal: tabIndex="1"
					if (ts.isStringLiteral(node.initializer)) {
						const parsed = Number(node.initializer.text);
						if (!isNaN(parsed)) {
							value = parsed;
						}
					}
					// Handle JSX expression: tabIndex={1}
					else if (ts.isJsxExpression(node.initializer)) {
						const expr = node.initializer.expression;
						if (expr && ts.isNumericLiteral(expr)) {
							value = Number(expr.text);
						}
					}

					if (value !== undefined && value > 0) {
						context.report({
							message: "noPositiveTabIndex",
							range: getTSNodeRange(node, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
