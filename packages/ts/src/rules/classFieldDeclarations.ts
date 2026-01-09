import ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports assigning literal values to `this` in constructors instead of using class field declarations.",
		id: "classFieldDeclarations",
		preset: "untyped",
	},
	messages: {
		preferClassField: {
			primary:
				"Prefer class field declaration over `this` assignment in constructor for static values.",
			secondary: [
				"Class field declarations are more concise and clearly express the intent of initializing properties.",
				"Moving property initialization to class fields keeps the constructor focused on dynamic initialization logic.",
			],
			suggestions: [
				"Move this property assignment to a class field declaration.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				Constructor: (node, { sourceFile }) => {
					if (!node.body) {
						return;
					}

					const classDeclaration = node.parent;
					if (
						!ts.isClassDeclaration(classDeclaration) &&
						!ts.isClassExpression(classDeclaration)
					) {
						return;
					}

					for (const statement of node.body.statements) {
						if (!ts.isExpressionStatement(statement)) {
							continue;
						}

						const expression = statement.expression;
						if (!ts.isBinaryExpression(expression)) {
							continue;
						}

						if (expression.operatorToken.kind !== ts.SyntaxKind.EqualsToken) {
							continue;
						}

						const left = expression.left;
						if (
							!ts.isPropertyAccessExpression(left) &&
							!ts.isElementAccessExpression(left)
						) {
							continue;
						}

						if (!ts.isPropertyAccessExpression(left)) {
							continue;
						}

						if (left.expression.kind !== ts.SyntaxKind.ThisKeyword) {
							continue;
						}

						const right = expression.right;
						if (!isLiteralValue(right)) {
							continue;
						}

						context.report({
							message: "preferClassField",
							range: {
								begin: statement.getStart(sourceFile),
								end: statement.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});

function isLiteralValue(node: ts.Node): boolean {
	if (ts.isLiteralExpression(node)) {
		return true;
	}

	if (
		node.kind === ts.SyntaxKind.TrueKeyword ||
		node.kind === ts.SyntaxKind.FalseKeyword
	) {
		return true;
	}

	if (node.kind === ts.SyntaxKind.NullKeyword) {
		return true;
	}

	if (ts.isPrefixUnaryExpression(node)) {
		return isLiteralValue(node.operand);
	}

	return false;
}
