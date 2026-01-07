import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";

const INDEX_METHODS = new Set([
	"findIndex",
	"findLastIndex",
	"indexOf",
	"lastIndexOf",
]);

function getReplacement(
	operator: ts.BinaryOperator,
	right: ts.Expression,
): undefined | { originalValue: string; replacementOperator: string } {
	if (operator === ts.SyntaxKind.LessThanToken && isZero(right)) {
		return {
			originalValue: "`< 0`",
			replacementOperator: "`=== -1`",
		};
	}

	if (operator === ts.SyntaxKind.GreaterThanToken && isNegativeOne(right)) {
		return {
			originalValue: "`> -1`",
			replacementOperator: "`!== -1`",
		};
	}

	if (operator === ts.SyntaxKind.GreaterThanEqualsToken && isZero(right)) {
		return {
			originalValue: "`>= 0`",
			replacementOperator: "`!== -1`",
		};
	}

	return undefined;
}

function isIndexMethodCall(node: ts.Expression): boolean {
	if (!ts.isCallExpression(node)) {
		return false;
	}

	if (!ts.isPropertyAccessExpression(node.expression)) {
		return false;
	}

	const methodName = node.expression.name.text;
	return INDEX_METHODS.has(methodName);
}

function isNegativeOne(node: ts.Expression): boolean {
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

function isZero(node: ts.Expression): boolean {
	return ts.isNumericLiteral(node) && node.text === "0";
}

export default typescriptLanguage.createRule({
	about: {
		description: "Enforces consistent style when checking if an index exists.",
		id: "arrayExistenceChecksConsistency",
		preset: "stylistic",
	},
	messages: {
		preferEqualityCheck: {
			primary:
				"Prefer {{ replacementOperator }} over {{ originalValue }} for checking existence.",
			secondary: [
				"Using explicit equality checks with `-1` is more readable than comparison operators.",
				"This pattern makes it clearer that you're checking whether an element exists or not.",
			],
			suggestions: [
				"Replace the comparison with an explicit check against `-1`.",
			],
		},
	},
	setup(context) {
		const indexVariables = new Map<ts.Symbol, true>();

		return {
			visitors: {
				BinaryExpression: (node, { sourceFile, typeChecker }) => {
					if (
						node.operatorToken.kind !== ts.SyntaxKind.LessThanToken &&
						node.operatorToken.kind !== ts.SyntaxKind.GreaterThanToken &&
						node.operatorToken.kind !== ts.SyntaxKind.GreaterThanEqualsToken
					) {
						return;
					}

					if (!ts.isIdentifier(node.left)) {
						return;
					}

					const symbol = typeChecker.getSymbolAtLocation(node.left);
					if (!symbol || !indexVariables.has(symbol)) {
						return;
					}

					const replacement = getReplacement(
						node.operatorToken.kind,
						node.right,
					);
					if (!replacement) {
						return;
					}

					context.report({
						data: replacement,
						message: "preferEqualityCheck",
						range: getTSNodeRange(node, sourceFile),
					});
				},
				VariableDeclaration: (node, { typeChecker }) => {
					if (!node.initializer) {
						return;
					}

					const parent = node.parent;
					if (
						!ts.isVariableDeclarationList(parent) ||
						!(parent.flags & ts.NodeFlags.Const)
					) {
						return;
					}

					if (!ts.isIdentifier(node.name)) {
						return;
					}

					if (!isIndexMethodCall(node.initializer)) {
						return;
					}

					const symbol = typeChecker.getSymbolAtLocation(node.name);
					if (symbol) {
						indexVariables.set(symbol, true);
					}
				},
			},
		};
	},
});
