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
			primary: "Curly braces are unnecessary around {{ type }}.",
			secondary: [
				"Curly braces are unnecessary when they wrap simple literals or JSX elements.",
				"Removing them improves readability and reduces visual clutter.",
			],
			suggestions: ["Remove the curly braces and use the content directly."],
		},
	},
	setup(context) {
		return {
			visitors: {
				JsxExpression(node, { sourceFile }) {
					if (
						!node.expression ||
						(!ts.isJsxElement(node.parent) && !ts.isJsxFragment(node.parent))
					) {
						return;
					}

					let unnecessaryType: string | undefined;

					if (ts.isStringLiteral(node.expression)) {
						unnecessaryType = "string literals";
					} else if (
						ts.isJsxElement(node.expression) ||
						ts.isJsxSelfClosingElement(node.expression) ||
						ts.isJsxFragment(node.expression)
					) {
						unnecessaryType = "JSX elements";
					}

					if (unnecessaryType) {
						context.report({
							data: { type: unnecessaryType },
							message: "unnecessaryBraces",
							range: getTSNodeRange(node, sourceFile),
						});
					}
				},
			},
		};
	},
});
