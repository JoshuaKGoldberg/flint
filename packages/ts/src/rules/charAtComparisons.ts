import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

const comparisonOperators = new Set([
	ts.SyntaxKind.EqualsEqualsEqualsToken,
	ts.SyntaxKind.EqualsEqualsToken,
	ts.SyntaxKind.ExclamationEqualsEqualsToken,
	ts.SyntaxKind.ExclamationEqualsToken,
]);

function getStringLiteralLength(node: ts.Expression): number | undefined {
	if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
		return node.text.length;
	}
	return undefined;
}

function isCharAtCall(node: ts.Expression): boolean {
	if (!ts.isCallExpression(node)) {
		return false;
	}

	if (!ts.isPropertyAccessExpression(node.expression)) {
		return false;
	}

	return node.expression.name.text === "charAt";
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports comparing charAt() results with strings longer than one character.",
		id: "charAtComparisons",
		preset: "logical",
	},
	messages: {
		invalidComparison: {
			primary:
				"Comparing charAt() result with a string of length {{ length }} is always {{ result }}.",
			secondary: [
				"The `charAt` method returns a string of exactly one character.",
				"Comparing it with a multi-character string will always evaluate to the same result.",
			],
			suggestions: [
				"Use a single-character string for the comparison.",
				"Consider using `startsWith()`, `includes()`, or `slice()` for multi-character comparisons.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				BinaryExpression: (node, { sourceFile }) => {
					if (!comparisonOperators.has(node.operatorToken.kind)) {
						return;
					}

					let charAtSide: ts.Expression | undefined;
					let literalSide: ts.Expression | undefined;

					if (isCharAtCall(node.left)) {
						charAtSide = node.left;
						literalSide = node.right;
					} else if (isCharAtCall(node.right)) {
						charAtSide = node.right;
						literalSide = node.left;
					}

					if (!charAtSide || !literalSide) {
						return;
					}

					const length = getStringLiteralLength(literalSide);
					if (length === undefined || length <= 1) {
						return;
					}

					const isEquality =
						node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken ||
						node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsToken;

					context.report({
						data: {
							length: String(length),
							result: isEquality ? "false" : "true",
						},
						message: "invalidComparison",
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
