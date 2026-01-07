import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports patterns that can be replaced with `.some()` for checking array element existence.",
		id: "arraySomeMethods",
		preset: "stylistic",
	},
	messages: {
		preferSome: {
			primary:
				"Use `.some()` to check if an array contains a matching element.",
			secondary: [
				"The `.some()` method is more explicit and efficient for existence checks.",
				"It stops iterating as soon as a match is found.",
			],
			suggestions: ["Replace with `.some()`."],
		},
	},
	setup(context) {
		return {
			visitors: {
				BinaryExpression: (node, { sourceFile, typeChecker }) => {
					const filterResult = checkFilterLengthComparison(node, typeChecker);
					if (filterResult) {
						const arrayText = filterResult.arrayExpression.getText(sourceFile);
						const callbackText = filterResult.callback.getText(sourceFile);

						context.report({
							fix: {
								range: {
									begin: node.getStart(sourceFile),
									end: node.getEnd(),
								},
								text: `${arrayText}.some(${callbackText})`,
							},
							message: "preferSome",
							range: {
								begin: node.getStart(sourceFile),
								end: node.getEnd(),
							},
						});
						return;
					}

					const findIndexResult = checkFindIndexComparison(node, typeChecker);
					if (findIndexResult) {
						const arrayText =
							findIndexResult.arrayExpression.getText(sourceFile);
						const callbackText = findIndexResult.callback.getText(sourceFile);

						context.report({
							fix: {
								range: {
									begin: node.getStart(sourceFile),
									end: node.getEnd(),
								},
								text: `${arrayText}.some(${callbackText})`,
							},
							message: "preferSome",
							range: {
								begin: node.getStart(sourceFile),
								end: node.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});

interface FilterCallInfo {
	arrayExpression: ts.Expression;
	callback: ts.Expression;
}

interface FindIndexCallInfo {
	arrayExpression: ts.Expression;
	callback: ts.Expression;
}

function checkFilterLengthComparison(
	node: ts.BinaryExpression,
	typeChecker: ts.TypeChecker,
): FilterCallInfo | undefined {
	if (!isNonZeroLengthCheck(node)) {
		return undefined;
	}

	const lengthAccess = getLengthAccess(node);
	if (!lengthAccess) {
		return undefined;
	}

	return getFilterCall(lengthAccess.expression, typeChecker);
}

function checkFindIndexComparison(
	node: ts.BinaryExpression,
	typeChecker: ts.TypeChecker,
): FindIndexCallInfo | undefined {
	if (!isFindIndexNegativeOneCheck(node)) {
		return undefined;
	}

	if (!ts.isCallExpression(node.left)) {
		return undefined;
	}

	return getFindIndexCall(node.left, typeChecker);
}

function getFilterCall(
	node: ts.Expression,
	typeChecker: ts.TypeChecker,
): FilterCallInfo | undefined {
	if (!ts.isCallExpression(node)) {
		return undefined;
	}

	if (!ts.isPropertyAccessExpression(node.expression)) {
		return undefined;
	}

	if (node.expression.name.text !== "filter") {
		return undefined;
	}

	if (node.arguments.length === 0) {
		return undefined;
	}

	if (!isArrayType(node.expression.expression, typeChecker)) {
		return undefined;
	}

	return {
		arrayExpression: node.expression.expression,
		callback: node.arguments[0],
	};
}

function getFindIndexCall(
	node: ts.CallExpression,
	typeChecker: ts.TypeChecker,
): FindIndexCallInfo | undefined {
	if (!ts.isPropertyAccessExpression(node.expression)) {
		return undefined;
	}

	const methodName = node.expression.name.text;
	if (methodName !== "findIndex" && methodName !== "findLastIndex") {
		return undefined;
	}

	if (node.arguments.length === 0) {
		return undefined;
	}

	if (!isArrayType(node.expression.expression, typeChecker)) {
		return undefined;
	}

	return {
		arrayExpression: node.expression.expression,
		callback: node.arguments[0],
	};
}

function getLengthAccess(node: ts.BinaryExpression) {
	if (!ts.isPropertyAccessExpression(node.left)) {
		return undefined;
	}

	if (node.left.name.text !== "length") {
		return undefined;
	}

	return node.left;
}

function isArrayType(node: ts.Expression, typeChecker: ts.TypeChecker) {
	const type = typeChecker.getTypeAtLocation(node);
	return typeChecker.isArrayType(type);
}

function isFindIndexNegativeOneCheck(node: ts.BinaryExpression) {
	if (node.operatorToken.kind !== ts.SyntaxKind.ExclamationEqualsEqualsToken) {
		return false;
	}

	if (!ts.isPrefixUnaryExpression(node.right)) {
		return false;
	}

	if (node.right.operator !== ts.SyntaxKind.MinusToken) {
		return false;
	}

	if (!ts.isNumericLiteral(node.right.operand)) {
		return false;
	}

	return node.right.operand.text === "1";
}

function isNonZeroLengthCheck(node: ts.BinaryExpression) {
	const { left, operatorToken, right } = node;

	if (
		operatorToken.kind === ts.SyntaxKind.GreaterThanToken &&
		ts.isNumericLiteral(right) &&
		right.text === "0"
	) {
		return true;
	}

	if (
		operatorToken.kind === ts.SyntaxKind.ExclamationEqualsEqualsToken &&
		ts.isNumericLiteral(right) &&
		right.text === "0"
	) {
		return true;
	}

	if (
		operatorToken.kind === ts.SyntaxKind.GreaterThanEqualsToken &&
		ts.isNumericLiteral(right) &&
		right.text === "1"
	) {
		return true;
	}

	if (
		operatorToken.kind === ts.SyntaxKind.LessThanToken &&
		ts.isNumericLiteral(left) &&
		left.text === "0"
	) {
		return true;
	}

	return false;
}
