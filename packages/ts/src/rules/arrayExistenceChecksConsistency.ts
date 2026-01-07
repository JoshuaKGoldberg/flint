import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

const indexMethods = new Set([
	"findIndex",
	"findLastIndex",
	"indexOf",
	"lastIndexOf",
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports inconsistent styles for checking element existence using index methods.",
		id: "arrayExistenceChecksConsistency",
		preset: "stylistic",
	},
	messages: {
		preferEqualsMinusOne: {
			primary:
				"Prefer `{{ replacement }}` over `{{ original }}` to check for non-existence.",
			secondary: [
				"Using `=== -1` is clearer and more consistent than `< 0`.",
				"Index methods return -1 when an element is not found, so checking against -1 is more explicit.",
			],
			suggestions: ["Replace with `{{ replacement }}`."],
		},
		preferNotEqualsMinusOne: {
			primary:
				"Prefer `{{ replacement }}` over `{{ original }}` to check for existence.",
			secondary: [
				"Using `!== -1` is clearer and more consistent than `>= 0` or `> -1`.",
				"Index methods return -1 when an element is not found, so checking against -1 is more explicit.",
			],
			suggestions: ["Replace with `{{ replacement }}`."],
		},
	},
	setup(context) {
		return {
			visitors: {
				BinaryExpression: (node, { sourceFile }) => {
					if (!isComparisonOperator(node.operatorToken.kind)) {
						return;
					}

					const indexCall = getIndexMethodCall(node.left);
					if (!indexCall) {
						return;
					}

					const numberValue = getNumericLiteralValue(node.right);
					if (numberValue === undefined) {
						return;
					}

					const issue = detectIssue(node.operatorToken.kind, numberValue);
					if (!issue) {
						return;
					}

					const indexCallText = indexCall.getText(sourceFile);
					const original = `${indexCallText} ${getOperatorText(node.operatorToken.kind)} ${numberValue}`;
					const replacement = `${indexCallText} ${issue.preferredOperator} -1`;

					context.report({
						data: { original, replacement },
						fix: {
							range: {
								begin: node.getStart(sourceFile),
								end: node.getEnd(),
							},
							text: replacement,
						},
						message: issue.message,
						range: {
							begin: node.operatorToken.getStart(sourceFile),
							end: node.right.getEnd(),
						},
					});
				},
			},
		};
	},
});

function detectIssue(
	operator: ts.SyntaxKind,
	value: number,
):
	| undefined
	| {
			message: "preferEqualsMinusOne" | "preferNotEqualsMinusOne";
			preferredOperator: string;
	  } {
	if (operator === ts.SyntaxKind.LessThanToken && value === 0) {
		return { message: "preferEqualsMinusOne", preferredOperator: "===" };
	}

	if (operator === ts.SyntaxKind.GreaterThanEqualsToken && value === 0) {
		return { message: "preferNotEqualsMinusOne", preferredOperator: "!==" };
	}

	if (operator === ts.SyntaxKind.GreaterThanToken && value === -1) {
		return { message: "preferNotEqualsMinusOne", preferredOperator: "!==" };
	}

	return undefined;
}

function getIndexMethodCall(node: ts.Node): ts.CallExpression | undefined {
	if (!ts.isCallExpression(node)) {
		return undefined;
	}

	if (!ts.isPropertyAccessExpression(node.expression)) {
		return undefined;
	}

	if (!indexMethods.has(node.expression.name.text)) {
		return undefined;
	}

	return node;
}

function getNumericLiteralValue(node: ts.Node): number | undefined {
	if (ts.isNumericLiteral(node)) {
		return Number(node.text);
	}

	if (
		ts.isPrefixUnaryExpression(node) &&
		node.operator === ts.SyntaxKind.MinusToken &&
		ts.isNumericLiteral(node.operand)
	) {
		return -Number(node.operand.text);
	}

	return undefined;
}

function getOperatorText(kind: ts.SyntaxKind) {
	switch (kind) {
		case ts.SyntaxKind.GreaterThanEqualsToken:
			return ">=";
		case ts.SyntaxKind.GreaterThanToken:
			return ">";
		case ts.SyntaxKind.LessThanEqualsToken:
			return "<=";
		case ts.SyntaxKind.LessThanToken:
			return "<";
		default:
			return "";
	}
}

function isComparisonOperator(kind: ts.SyntaxKind) {
	return (
		kind === ts.SyntaxKind.LessThanToken ||
		kind === ts.SyntaxKind.LessThanEqualsToken ||
		kind === ts.SyntaxKind.GreaterThanToken ||
		kind === ts.SyntaxKind.GreaterThanEqualsToken
	);
}
