import { runtimeBase } from "@flint.fyi/core";

import { typescriptLanguage } from "../language.js";
import { hasSameTokens } from "../utils/hasSameTokens.js";
import { isComparisonOperator } from "./utils/operators.js";

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
	setup() {
		return {
			...runtimeBase,
			visitors: {
				BinaryExpression: (node, context) => {
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
