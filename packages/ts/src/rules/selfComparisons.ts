import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports comparing a value to itself.",
		id: "selfComparisons",
		preset: "logical",
	},
	messages: {
		noSelfComparison: {
			primary:
				"Comparing a value to itself is unnecessary and likely indicates a logic error.",
			secondary: [
				"Self-comparisons always evaluate to the same result for a given operator.",
				"This pattern often indicates a copy-paste error or typo where different variables were intended.",
			],
			suggestions: [
				"Verify that you intended to compare two different values.",
				"If checking for NaN, use `Number.isNaN()` or `isNaN()` instead.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				BinaryExpression: (node) => {
					// Check if this is a comparison operator
					const operator = node.operatorToken.kind;
					if (
						operator !== ts.SyntaxKind.EqualsEqualsToken &&
						operator !== ts.SyntaxKind.ExclamationEqualsToken &&
						operator !== ts.SyntaxKind.EqualsEqualsEqualsToken &&
						operator !== ts.SyntaxKind.ExclamationEqualsEqualsToken &&
						operator !== ts.SyntaxKind.LessThanToken &&
						operator !== ts.SyntaxKind.LessThanEqualsToken &&
						operator !== ts.SyntaxKind.GreaterThanToken &&
						operator !== ts.SyntaxKind.GreaterThanEqualsToken
					) {
						return;
					}

					// Compare the text representation of both sides
					const leftText = node.left.getText(context.sourceFile);
					const rightText = node.right.getText(context.sourceFile);

					if (leftText === rightText) {
						const range = {
							begin: node.getStart(context.sourceFile),
							end: node.getEnd(),
						};

						context.report({
							message: "noSelfComparison",
							range,
						});
					}
				},
			},
		};
	},
});
