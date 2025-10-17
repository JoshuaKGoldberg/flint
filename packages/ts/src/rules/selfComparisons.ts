import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";
import { isComparisonOperator } from "./utils/operators.js";

function hasSameTokens(
	nodeA: ts.Node,
	nodeB: ts.Node,
	sourceFile: ts.SourceFile,
): boolean {
	const queueA: ts.Node[] = [nodeA];
	const queueB: ts.Node[] = [nodeB];

	while (queueA.length > 0 && queueB.length > 0) {
		const currentA = queueA.shift();
		const currentB = queueB.shift();

		if (!currentA || !currentB) {
			break;
		}

		const isTokenA =
			currentA.kind >= ts.SyntaxKind.FirstToken &&
			currentA.kind <= ts.SyntaxKind.LastToken;
		const isTokenB =
			currentB.kind >= ts.SyntaxKind.FirstToken &&
			currentB.kind <= ts.SyntaxKind.LastToken;

		if (isTokenA && isTokenB) {
			// Both are tokens - compare them
			if (
				currentA.kind !== currentB.kind ||
				currentA.getText(sourceFile) !== currentB.getText(sourceFile)
			) {
				return false;
			}
		} else if (isTokenA || isTokenB) {
			// One is a token, the other isn't - they differ
			return false;
		} else {
			// Both are non-tokens - add children to queue
			const childrenA = currentA.getChildren(sourceFile);
			const childrenB = currentB.getChildren(sourceFile);

			if (childrenA.length !== childrenB.length) {
				return false;
			}

			queueA.push(...childrenA);
			queueB.push(...childrenB);
		}
	}

	// Both queues should be empty at the same time
	return queueA.length === queueB.length;
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
