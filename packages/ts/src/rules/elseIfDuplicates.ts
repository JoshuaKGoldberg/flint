import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports duplicate conditions in if-else-if chains that make the code unreachable.",
		id: "elseIfDuplicates",
		preset: "logical",
	},
	messages: {
		duplicateCondition: {
			primary:
				"This condition is identical to a previous condition in the if-else-if chain.",
			secondary: [
				"When an if-else-if chain has duplicate conditions, the duplicate branch will never execute because the earlier identical condition will always be evaluated first.",
				"This typically indicates a copy-paste error or logic mistake.",
			],
			suggestions: [
				"Verify the condition logic is correct and update to check for the intended condition.",
			],
		},
	},
	setup(context) {
		function checkIfStatement(node: ts.IfStatement) {
			const conditions = new Map<string, ts.Expression>();
			let current: ts.IfStatement = node;

			while (true) {
				const conditionText = current.expression.getText(context.sourceFile);

				if (conditions.has(conditionText)) {
					context.report({
						message: "duplicateCondition",
						range: getTSNodeRange(current.expression, context.sourceFile),
					});
				} else {
					conditions.set(conditionText, current.expression);
				}

				if (!current.elseStatement) {
					break;
				}

				if (ts.isIfStatement(current.elseStatement)) {
					current = current.elseStatement;
				} else {
					break;
				}
			}
		}

		return {
			visitors: {
				IfStatement: (node) => {
					if (
						!ts.isIfStatement(node.parent) ||
						node.parent.elseStatement !== node
					) {
						checkIfStatement(node);
					}
				},
			},
		};
	},
});
