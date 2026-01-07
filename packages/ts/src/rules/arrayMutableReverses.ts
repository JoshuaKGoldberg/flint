import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports `.reverse()` calls on arrays that mutate the original array.",
		id: "arrayMutableReverses",
		preset: "stylistic",
	},
	messages: {
		preferToReversed: {
			primary:
				"Use `.toReversed()` instead of `.reverse()` to avoid mutating the original array.",
			secondary: [
				"The `.reverse()` method mutates the array in place.",
				"The `.toReversed()` method returns a new reversed array without modifying the original.",
			],
			suggestions: ["Replace `.reverse()` with `.toReversed()`."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { sourceFile, typeChecker }) => {
					if (!ts.isPropertyAccessExpression(node.expression)) {
						return;
					}

					if (node.expression.name.text !== "reverse") {
						return;
					}

					if (node.arguments.length !== 0) {
						return;
					}

					if (!isArrayType(node.expression.expression, typeChecker)) {
						return;
					}

					if (isExpressionStatement(node)) {
						return;
					}

					const arrayText = node.expression.expression.getText(sourceFile);

					context.report({
						fix: {
							range: {
								begin: node.getStart(sourceFile),
								end: node.getEnd(),
							},
							text: `${arrayText}.toReversed()`,
						},
						message: "preferToReversed",
						range: {
							begin: node.expression.name.getStart(sourceFile),
							end: node.getEnd(),
						},
					});
				},
			},
		};
	},
});

function isArrayType(node: ts.Node, typeChecker: ts.TypeChecker) {
	const type = typeChecker.getTypeAtLocation(node);
	return typeChecker.isArrayType(type);
}

function isExpressionStatement(node: ts.Node) {
	return ts.isExpressionStatement(node.parent);
}
