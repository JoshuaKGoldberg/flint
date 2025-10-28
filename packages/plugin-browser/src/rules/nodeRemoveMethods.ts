import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer the modern `node.remove()` method over the legacy `parentNode.removeChild(node)` API.",
		id: "nodeRemoveMethods",
		preset: "logical",
	},
	messages: {
		preferRemove: {
			primary:
				"Prefer the modern `{{ child }}.remove()` over `{{ parent }}.removeChild({{ child }})`.",
			secondary: [
				"The `Node.remove()` method is a more direct and modern way to remove an element from the DOM.",
				"It's more concise and easier to read than the legacy `removeChild()` API.",
			],
			suggestions: ["Use `{{ child }}.remove()` instead."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression(node: ts.CallExpression) {
					// Check if this is a removeChild call
					if (
						!ts.isPropertyAccessExpression(node.expression) ||
						!ts.isIdentifier(node.expression.name) ||
						node.expression.name.text !== "removeChild" ||
						node.arguments.length !== 1
					) {
						return;
					}

					const parent = node.expression.expression;
					const child = node.arguments[0];

					// Get text representations
					const parentText = parent.getText(context.sourceFile);
					const childText = child.getText(context.sourceFile);

					context.report({
						data: {
							child: childText,
							parent: parentText,
						},
						fix: [
							{
								range: getTSNodeRange(node, context.sourceFile),
								text: `${childText}.remove()`,
							},
						],
						message: "preferRemove",
						range: getTSNodeRange(node.expression.name, context.sourceFile),
					});
				},
			},
		};
	},
});
