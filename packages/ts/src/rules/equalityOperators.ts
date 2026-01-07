import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

function isLiteral(node: ts.Expression) {
	return (
		ts.isStringLiteral(node) ||
		ts.isNumericLiteral(node) ||
		ts.isBigIntLiteral(node) ||
		node.kind === ts.SyntaxKind.TrueKeyword ||
		node.kind === ts.SyntaxKind.FalseKeyword ||
		node.kind === ts.SyntaxKind.NullKeyword ||
		node.kind === ts.SyntaxKind.UndefinedKeyword ||
		(ts.isIdentifier(node) && node.text === "undefined")
	);
}

function isLooseEqualityOperator(
	token: ts.BinaryOperatorToken,
): token is ts.Token<
	ts.SyntaxKind.EqualsEqualsToken | ts.SyntaxKind.ExclamationEqualsToken
> {
	return (
		token.kind === ts.SyntaxKind.EqualsEqualsToken ||
		token.kind === ts.SyntaxKind.ExclamationEqualsToken
	);
}

function isNullLiteral(node: ts.Expression) {
	return node.kind === ts.SyntaxKind.NullKeyword;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using loose equality operators instead of strict equality.",
		id: "equalityOperators",
		preset: "logical",
	},
	messages: {
		useStrictEquality: {
			primary: "Use `{{ strict }}` instead of `{{ loose }}`.",
			secondary: [
				"Loose equality operators (`==` and `!=`) perform type coercion, which can lead to unexpected results.",
				"Strict equality operators (`===` and `!==`) compare both value and type without coercion.",
			],
			suggestions: [
				"Replace the loose equality operator with its strict equivalent.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				BinaryExpression: (node, { sourceFile }) => {
					if (!isLooseEqualityOperator(node.operatorToken)) {
						return;
					}

					const { left, right } = node;

					if (isNullLiteral(left) || isNullLiteral(right)) {
						return;
					}

					if (ts.isTypeOfExpression(left) || ts.isTypeOfExpression(right)) {
						return;
					}

					if (isLiteral(left) && isLiteral(right)) {
						return;
					}

					const isNotEquals =
						node.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsToken;
					const loose = isNotEquals ? "!=" : "==";
					const strict = isNotEquals ? "!==" : "===";

					const operatorRange = {
						begin: node.operatorToken.getStart(sourceFile),
						end: node.operatorToken.getEnd(),
					};

					context.report({
						data: { loose, strict },
						message: "useStrictEquality",
						range: operatorRange,
						suggestions: [
							{
								id: "useStrictEquality",
								range: operatorRange,
								text: strict,
							},
						],
					});
				},
			},
		};
	},
});
