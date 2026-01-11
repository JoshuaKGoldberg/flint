import { SyntaxKind } from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallow using the delete operator on computed key expressions.",
		id: "dynamicDeletes",
		preset: "logical",
	},
	messages: {
		dynamicDelete: {
			primary:
				"Using the `delete` operator on a computed key can be dangerous and is often not well optimized.",
			secondary: [
				"In modern code, JavaScript objects are generally intended to be optimized as static shapes by engines.",
				"Consider using a `Map` or `Set` if you need to dynamically add and remove keys.",
			],
			suggestions: [
				"Use a `Map` or `Set` instead of an object for dynamic keys.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				DeleteExpression: (node, { sourceFile }) => {
					if (node.expression.kind !== SyntaxKind.ElementAccessExpression) {
						return;
					}

					const elementAccess = node.expression;
					const { argumentExpression } = elementAccess;

					if (argumentExpression.kind === SyntaxKind.StringLiteral) {
						return;
					}

					if (argumentExpression.kind === SyntaxKind.NumericLiteral) {
						return;
					}

					context.report({
						message: "dynamicDelete",
						range: {
							begin: node.getStart(sourceFile),
							end: node.getEnd(),
						},
					});
				},
			},
		};
	},
});
