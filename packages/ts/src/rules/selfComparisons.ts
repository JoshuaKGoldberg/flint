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

	while (true) {
		const currentA = queueA.shift();
		const currentB = queueB.shift();

		if (!currentA || !currentB) {
			break;
		}

		if (currentA.kind !== currentB.kind) {
			return false;
		}

		const isToken =
			currentA.kind >= ts.SyntaxKind.FirstToken &&
			currentA.kind <= ts.SyntaxKind.LastToken;

		if (isToken) {
			if (currentA.getText(sourceFile) !== currentB.getText(sourceFile)) {
				return false;
			}
		} else {
			const childrenA = currentA.getChildren(sourceFile);
			const childrenB = currentB.getChildren(sourceFile);

			if (childrenA.length !== childrenB.length) {
				return false;
			}

			queueA.push(...childrenA);
			queueB.push(...childrenB);
		}
	}

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
					if (
						isComparisonOperator(node.operatorToken) &&
						hasSameTokens(node.left, node.right, context.sourceFile)
					) {
						context.report({
							message: "noSelfComparison",
							range: {
								begin: node.getStart(context.sourceFile),
								end: node.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
