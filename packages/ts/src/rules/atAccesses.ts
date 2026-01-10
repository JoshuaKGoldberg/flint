import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import type { AST } from "../index.ts";
import { typescriptLanguage } from "../language.ts";
import { hasSameTokens } from "../utils/hasSameTokens.ts";
import { unwrapParenthesizedExpression } from "../utils/unwrapParenthesizedExpression.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer using .at() for accessing elements at negative indices.",
		id: "atAccesses",
		preset: "stylistic",
	},
	messages: {
		preferAt: {
			primary:
				"Prefer using .at() with a negative index instead of calculating length minus an offset.",
			secondary: [
				"The .at() method provides a cleaner way to access elements from the end of an array or string.",
				"Using .at(-1) is more readable than array[array.length - 1].",
			],
			suggestions: [
				"Use .at() with a negative index to access elements from the end.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				ElementAccessExpression: (node, { sourceFile }) => {
					if (isLeftHandSide(node)) {
						return;
					}

					if (!isLengthMinusAccess(node, sourceFile)) {
						return;
					}

					context.report({
						message: "preferAt",
						range: getTSNodeRange(node, sourceFile),
					});
				},
			},
		};
	},
});

function isLeftHandSide(node: AST.ElementAccessExpression): boolean {
	const parent = node.parent;

	if (
		ts.isBinaryExpression(parent) &&
		tsutils.isAssignmentKind(parent.operatorToken.kind) &&
		parent.left === node
	) {
		return true;
	}

	if (
		(ts.isPostfixUnaryExpression(parent) ||
			ts.isPrefixUnaryExpression(parent)) &&
		parent.operand === node
	) {
		return true;
	}

	if (ts.isDeleteExpression(parent)) {
		return true;
	}

	if (ts.isArrayLiteralExpression(parent)) {
		const grandparent = parent.parent;
		if (
			ts.isBinaryExpression(grandparent) &&
			tsutils.isAssignmentKind(grandparent.operatorToken.kind) &&
			grandparent.left === parent
		) {
			return true;
		}
	}

	if (
		ts.isPropertyAssignment(parent) ||
		ts.isShorthandPropertyAssignment(parent)
	) {
		const objectLiteral = parent.parent;
		if (ts.isObjectLiteralExpression(objectLiteral)) {
			const greatGrandparent = objectLiteral.parent;
			if (
				ts.isBinaryExpression(greatGrandparent) &&
				tsutils.isAssignmentKind(greatGrandparent.operatorToken.kind) &&
				greatGrandparent.left === objectLiteral
			) {
				return true;
			}
		}
	}

	return false;
}

function isLengthMinusAccess(
	node: AST.ElementAccessExpression,
	sourceFile: ts.SourceFile,
) {
	const argument = unwrapParenthesizedExpression(
		node.argumentExpression,
	) as AST.Expression;

	if (!ts.isBinaryExpression(argument)) {
		return false;
	}

	if (argument.operatorToken.kind !== ts.SyntaxKind.MinusToken) {
		return false;
	}

	const left = unwrapParenthesizedExpression(argument.left) as AST.Expression;
	if (!ts.isPropertyAccessExpression(left)) {
		return false;
	}

	if (left.name.text !== "length") {
		return false;
	}

	const unwrappedLengthExpression = unwrapParenthesizedExpression(
		left.expression,
	) as AST.Expression;
	const unwrappedNodeExpression = unwrapParenthesizedExpression(
		node.expression,
	) as AST.Expression;

	if (
		!hasSameTokens(
			unwrappedLengthExpression,
			unwrappedNodeExpression,
			sourceFile,
		)
	) {
		return false;
	}

	const right = unwrapParenthesizedExpression(argument.right) as AST.Expression;
	if (!ts.isNumericLiteral(right)) {
		return false;
	}

	const offset = Number(right.text);
	if (!Number.isInteger(offset) || offset <= 0) {
		return false;
	}

	return true;
}
