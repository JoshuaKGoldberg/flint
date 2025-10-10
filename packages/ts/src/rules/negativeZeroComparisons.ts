import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports comparisons with -0 that may not behave as expected.",
		id: "negativeZeroComparisons",
		preset: "logical",
	},
	messages: {
		unexpectedNegativeZeroComparison: {
			primary:
				"Comparisons with -0 using {{ operator }} do not distinguish between -0 and +0.",
			secondary: [
				"In JavaScript, -0 and +0 are considered equal when using comparison operators like === or ==, even though they are distinct values.",
				"To properly check for -0, use Object.is(value, -0) which correctly distinguishes between -0 and +0.",
			],
			suggestions: ["Use Object.is() to reliably check if a value is -0."],
		},
	},
	setup(context) {
		function isNegativeZero(node: ts.Node): boolean {
			return (
				ts.isPrefixUnaryExpression(node) &&
				node.operator === ts.SyntaxKind.MinusToken &&
				ts.isNumericLiteral(node.operand) &&
				node.operand.text === "0"
			);
		}

		return {
			visitors: {
				BinaryExpression: (node) => {
					if (
						node.operatorToken.kind !== ts.SyntaxKind.EqualsEqualsToken &&
						node.operatorToken.kind !== ts.SyntaxKind.EqualsEqualsEqualsToken &&
						node.operatorToken.kind !== ts.SyntaxKind.ExclamationEqualsToken &&
						node.operatorToken.kind !==
							ts.SyntaxKind.ExclamationEqualsEqualsToken &&
						node.operatorToken.kind !== ts.SyntaxKind.LessThanToken &&
						node.operatorToken.kind !== ts.SyntaxKind.LessThanEqualsToken &&
						node.operatorToken.kind !== ts.SyntaxKind.GreaterThanToken &&
						node.operatorToken.kind !== ts.SyntaxKind.GreaterThanEqualsToken
					) {
						return;
					}

					if (!isNegativeZero(node.left) && !isNegativeZero(node.right)) {
						return;
					}

					const operator = node.operatorToken.getText(context.sourceFile);

					context.report({
						data: {
							operator,
						},
						message: "unexpectedNegativeZeroComparison",
						range: {
							begin: node.getStart(context.sourceFile),
							end: node.getEnd(),
						},
					});
				},
			},
		};
	},
});
