import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";
import { isComparisonOperator } from "./utils/operators.js";

function hasSameTokens(
	nodeA: ts.Node,
	nodeB: ts.Node,
	sourceFile: ts.SourceFile,
): boolean {
	const tokensA: ts.Node[] = [];
	const tokensB: ts.Node[] = [];

	function collectTokens(node: ts.Node, tokens: ts.Node[]) {
		if (
			node.kind >= ts.SyntaxKind.FirstToken &&
			node.kind <= ts.SyntaxKind.LastToken
		) {
			tokens.push(node);
		}
		ts.forEachChild(node, (child) => {
			collectTokens(child, tokens);
		});
	}

	collectTokens(nodeA, tokensA);
	collectTokens(nodeB, tokensB);

	return (
		tokensA.length === tokensB.length &&
		tokensA.every(
			(token, index) =>
				token.kind === tokensB[index].kind &&
				token.getText(sourceFile) === tokensB[index].getText(sourceFile),
		)
	);
}

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
					if (!isComparisonOperator(node.operatorToken)) {
						return;
					}

					if (!hasSameTokens(node.left, node.right, context.sourceFile)) {
						return;
					}

					const range = {
						begin: node.getStart(context.sourceFile),
						end: node.getEnd(),
					};

					context.report({
						message: "noSelfComparison",
						range,
					});
				},
			},
		};
	},
});
