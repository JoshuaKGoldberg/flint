import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";

function getConditionDirection(
	condition: ts.Expression,
	counterName: string,
): -1 | 1 | undefined {
	if (!ts.isBinaryExpression(condition)) {
		return undefined;
	}

	const leftName = getCounterName(condition.left);
	const rightName = getCounterName(condition.right);

	if (!leftName && !rightName) {
		return condition.operatorToken.kind ===
			ts.SyntaxKind.AmpersandAmpersandToken
			? (getConditionDirection(condition.left, counterName) ??
					getConditionDirection(condition.right, counterName))
			: undefined;
	}

	const isCounterLeft = leftName === counterName;
	const isCounterRight = rightName === counterName;

	if (!isCounterLeft && !isCounterRight) {
		return undefined;
	}

	const { operatorToken } = condition;

	if (isCounterLeft) {
		if (
			operatorToken.kind === ts.SyntaxKind.LessThanToken ||
			operatorToken.kind === ts.SyntaxKind.LessThanEqualsToken
		) {
			return 1;
		}
		if (
			operatorToken.kind === ts.SyntaxKind.GreaterThanToken ||
			operatorToken.kind === ts.SyntaxKind.GreaterThanEqualsToken
		) {
			return -1;
		}
	} else {
		if (
			operatorToken.kind === ts.SyntaxKind.LessThanToken ||
			operatorToken.kind === ts.SyntaxKind.LessThanEqualsToken
		) {
			return -1;
		}
		if (
			operatorToken.kind === ts.SyntaxKind.GreaterThanToken ||
			operatorToken.kind === ts.SyntaxKind.GreaterThanEqualsToken
		) {
			return 1;
		}
	}

	return undefined;
}

function getCounterName(node: ts.Expression) {
	return ts.isIdentifier(node) ? node.text : undefined;
}

function getIncrementorDirection(incrementor: ts.Expression) {
	if (
		ts.isPostfixUnaryExpression(incrementor) ||
		ts.isPrefixUnaryExpression(incrementor)
	) {
		switch (incrementor.operator) {
			case ts.SyntaxKind.MinusMinusToken:
				return -1;
			case ts.SyntaxKind.PlusPlusToken:
				return 1;
			default:
				return undefined;
		}
	}

	if (ts.isBinaryExpression(incrementor)) {
		const { operatorToken, right } = incrementor;

		if (
			operatorToken.kind === ts.SyntaxKind.PlusEqualsToken ||
			operatorToken.kind === ts.SyntaxKind.MinusEqualsToken
		) {
			if (ts.isNumericLiteral(right)) {
				const value = Number(right.text);
				if (operatorToken.kind === ts.SyntaxKind.PlusEqualsToken) {
					return value > 0 ? 1 : value < 0 ? -1 : 0;
				}
				return value > 0 ? -1 : value < 0 ? 1 : 0;
			}

			if (
				ts.isPrefixUnaryExpression(right) &&
				right.operator === ts.SyntaxKind.MinusToken &&
				ts.isNumericLiteral(right.operand)
			) {
				const value = Number(right.operand.text);
				if (operatorToken.kind === ts.SyntaxKind.PlusEqualsToken) {
					return value > 0 ? -1 : 1;
				}
				return value > 0 ? 1 : -1;
			}
		}
	}

	return undefined;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports for loops with counter variables that move in the wrong direction.",
		id: "forDirections",
		preset: "stylistic",
	},
	messages: {
		wrongDirection: {
			primary:
				"The update moves the counter in the wrong direction for this loop condition.",
			secondary: [
				"A for loop with a counter that moves in the wrong direction relative to its stop condition will run infinitely or never execute.",
				"When the counter increases but the condition expects it to decrease (or vice versa), the loop logic is incorrect.",
			],
			suggestions: [
				"Verify the loop counter update direction matches the condition.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				ForStatement: (node, { sourceFile }) => {
					if (
						!node.condition ||
						!node.incrementor ||
						!node.initializer ||
						!ts.isVariableDeclarationList(node.initializer)
					) {
						return;
					}

					const declaration = node.initializer.declarations.at(0);
					if (!declaration || !ts.isIdentifier(declaration.name)) {
						return;
					}

					const updateDirection = getIncrementorDirection(node.incrementor);
					if (!updateDirection) {
						return;
					}

					const conditionDirection = getConditionDirection(
						node.condition,
						declaration.name.text,
					);

					if (conditionDirection && conditionDirection !== updateDirection) {
						context.report({
							message: "wrongDirection",
							range: getTSNodeRange(node.incrementor, sourceFile),
						});
					}
				},
			},
		};
	},
});
