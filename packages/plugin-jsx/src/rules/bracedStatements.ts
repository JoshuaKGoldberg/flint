import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallow unnecessary JSX curly braces around literals and JSX elements.",
		id: "bracedStatements",
		preset: "stylistic",
	},
	messages: {
		unnecessaryBraces: {
			primary: "Prefer removing unnecessary curly braces around {{ type }}.",
			secondary: [
				"Curly braces are unnecessary when they wrap simple literals or JSX elements.",
				"Removing them improves readability and reduces visual clutter.",
			],
			suggestions: ["Remove the curly braces and use the content directly."],
		},
	},
	setup(context) {
		function checkJsxExpression(node: ts.JsxExpression) {
			const expression = node.expression;
			if (!expression) {
				return;
			}

			// Only check JSX expressions that are children, not in attributes
			const parent = node.parent;
			if (!ts.isJsxElement(parent) && !ts.isJsxFragment(parent)) {
				return;
			}

			let unnecessaryType: string | undefined;

			if (ts.isStringLiteral(expression)) {
				unnecessaryType = "string literals";
			} else if (
				ts.isJsxElement(expression) ||
				ts.isJsxSelfClosingElement(expression) ||
				ts.isJsxFragment(expression)
			) {
				unnecessaryType = "JSX elements";
			}

			if (unnecessaryType) {
				context.report({
					data: { type: unnecessaryType },
					message: "unnecessaryBraces",
					range: getTSNodeRange(node, context.sourceFile),
				});
			}
		}

		return {
			visitors: {
				JsxExpression(node: ts.JsxExpression) {
					checkJsxExpression(node);
				},
			},
		};
	},
});
