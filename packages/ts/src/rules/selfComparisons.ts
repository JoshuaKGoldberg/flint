import { typescriptLanguage } from "../language.js";
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
	setup(context) {
		return {
			visitors: {
				BinaryExpression: (node) => {
					if (!isComparisonOperator(node.operatorToken)) {
						return;
					}

					const leftText = node.left.getText(context.sourceFile);
					const rightText = node.right.getText(context.sourceFile);

					if (leftText !== rightText) {
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
