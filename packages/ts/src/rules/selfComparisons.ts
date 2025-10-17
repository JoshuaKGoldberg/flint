import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";
import { isComparisonOperator } from "./utils/operators.js";

function* getTokens(node: ts.Node): Generator<ts.Node> {
	if (
		node.kind >= ts.SyntaxKind.FirstToken &&
		node.kind <= ts.SyntaxKind.LastToken
	) {
		yield node;
		return;
	}

	// Recursively yield tokens from children
	const children: ts.Node[] = [];
	ts.forEachChild(node, (child) => {
		children.push(child);
	});

	for (const child of children) {
		yield* getTokens(child);
	}
}

function hasSameTokens(
	nodeA: ts.Node,
	nodeB: ts.Node,
	sourceFile: ts.SourceFile,
): boolean {
	const iteratorA = getTokens(nodeA);
	const iteratorB = getTokens(nodeB);

	let resultA = iteratorA.next();
	let resultB = iteratorB.next();

	while (!resultA.done && !resultB.done) {
		const tokenA = resultA.value;
		const tokenB = resultB.value;

		if (
			tokenA.kind !== tokenB.kind ||
			tokenA.getText(sourceFile) !== tokenB.getText(sourceFile)
		) {
			return false;
		}

		resultA = iteratorA.next();
		resultB = iteratorB.next();
	}

	// Both iterators should be exhausted at the same time
	return resultA.done === resultB.done;
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
