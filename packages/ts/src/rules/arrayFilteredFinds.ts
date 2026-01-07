import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";

function isArrayFilterCall(node: ts.Expression): node is ts.CallExpression {
	if (!ts.isCallExpression(node)) {
		return false;
	}

	if (!ts.isPropertyAccessExpression(node.expression)) {
		return false;
	}

	const methodName = node.expression.name.text;
	if (methodName !== "filter") {
		return false;
	}

	return node.arguments.length >= 1 && node.arguments.length <= 2;
}

function isNegativeOneIndex(node: ts.Expression): boolean {
	if (
		ts.isPrefixUnaryExpression(node) &&
		node.operator === ts.SyntaxKind.MinusToken &&
		ts.isNumericLiteral(node.operand) &&
		node.operand.text === "1"
	) {
		return true;
	}

	return false;
}

function isZeroIndex(node: ts.Expression): boolean {
	return ts.isNumericLiteral(node) && node.text === "0";
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using `.filter()` when only the first or last matching element is needed.",
		id: "arrayFilteredFinds",
		preset: "logical",
	},
	messages: {
		preferFind: {
			primary: "Prefer `.find()` over `.filter()[0]`.",
			secondary: [
				"Using `.filter()` to get only the first matching element creates an unnecessary intermediate array.",
				"The `.find()` method is more efficient as it stops iteration once a match is found.",
			],
			suggestions: ["Replace `.filter(callback)[0]` with `.find(callback)`."],
		},
		preferFindLast: {
			primary:
				"Prefer `.findLast()` over `.filter().pop()` or `.filter().at(-1)`.",
			secondary: [
				"Using `.filter()` to get only the last matching element creates an unnecessary intermediate array.",
				"The `.findLast()` method is more efficient as it iterates from the end and stops once a match is found.",
			],
			suggestions: [
				"Replace `.filter(callback).pop()` or `.filter(callback).at(-1)` with `.findLast(callback)`.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { sourceFile }) => {
					if (!ts.isPropertyAccessExpression(node.expression)) {
						return;
					}

					const methodName = node.expression.name.text;
					const objectExpression = node.expression.expression;

					if (methodName === "shift" && node.arguments.length === 0) {
						if (isArrayFilterCall(objectExpression)) {
							context.report({
								message: "preferFind",
								range: getTSNodeRange(node, sourceFile),
							});
						}
						return;
					}

					if (methodName === "pop" && node.arguments.length === 0) {
						if (isArrayFilterCall(objectExpression)) {
							context.report({
								message: "preferFindLast",
								range: getTSNodeRange(node, sourceFile),
							});
						}
						return;
					}

					if (
						methodName === "at" &&
						node.arguments.length === 1 &&
						node.arguments[0]
					) {
						const arg = node.arguments[0];

						if (isZeroIndex(arg) && isArrayFilterCall(objectExpression)) {
							context.report({
								message: "preferFind",
								range: getTSNodeRange(node, sourceFile),
							});
							return;
						}

						if (
							isNegativeOneIndex(arg) &&
							isArrayFilterCall(objectExpression)
						) {
							context.report({
								message: "preferFindLast",
								range: getTSNodeRange(node, sourceFile),
							});
						}
					}
				},
				ElementAccessExpression: (node, { sourceFile }) => {
					if (!isZeroIndex(node.argumentExpression)) {
						return;
					}

					if (isArrayFilterCall(node.expression)) {
						context.report({
							message: "preferFind",
							range: getTSNodeRange(node, sourceFile),
						});
					}
				},
			},
		};
	},
});
