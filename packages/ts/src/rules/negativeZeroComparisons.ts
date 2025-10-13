import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

const comparisonOperators = new Set([
	ts.SyntaxKind.EqualsEqualsEqualsToken,
	ts.SyntaxKind.EqualsEqualsToken,
	ts.SyntaxKind.ExclamationEqualsEqualsToken,
	ts.SyntaxKind.ExclamationEqualsToken,
	ts.SyntaxKind.GreaterThanEqualsToken,
	ts.SyntaxKind.GreaterThanToken,
	ts.SyntaxKind.LessThanEqualsToken,
	ts.SyntaxKind.LessThanToken,
]);

function isEqualityOperator(operator: string) {
	return (
		operator === "===" ||
		operator === "==" ||
		operator === "!==" ||
		operator === "!="
	);
}

function isNegatedEqualityOperator(operator: string) {
	return operator === "!==" || operator === "!=";
}

function isNegativeZero(node: ts.Node): boolean {
	return (
		ts.isPrefixUnaryExpression(node) &&
		node.operator === ts.SyntaxKind.MinusToken &&
		ts.isNumericLiteral(node.operand) &&
		node.operand.text === "0"
	);
}

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
				"To properly check for -0, use `Object.is(value, -0)` which correctly distinguishes between -0 and +0.",
			],
			suggestions: ["Use `Object.is()` to reliably check if a value is -0."],
		},
	},
	setup(context) {
		function generateObjectIsText(
			node: ts.BinaryExpression,
			isNegated: boolean,
		) {
			const leftText = node.left.getText(context.sourceFile);
			const rightText = node.right.getText(context.sourceFile);
			const objectIsCall = `Object.is(${leftText}, ${rightText})`;

			return isNegated ? `!${objectIsCall}` : objectIsCall;
		}

		return {
			visitors: {
				BinaryExpression: (node) => {
					if (
						!comparisonOperators.has(node.operatorToken.kind) ||
						(!isNegativeZero(node.left) && !isNegativeZero(node.right))
					) {
						return;
					}

					const operator = node.operatorToken.getText(context.sourceFile);
					const range = {
						begin: node.getStart(context.sourceFile),
						end: node.getEnd(),
					};

					context.report({
						data: {
							operator,
						},
						message: "unexpectedNegativeZeroComparison",
						range,
						suggestions: isEqualityOperator(operator)
							? [
									{
										id: "useObjectIs",
										range,
										text: generateObjectIsText(
											node,
											isNegatedEqualityOperator(operator),
										),
									},
								]
							: undefined,
					});
				},
			},
		};
	},
});
