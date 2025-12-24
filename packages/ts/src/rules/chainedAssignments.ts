import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";
import { unwrapParenthesizedExpression } from "../utils/unwrapParenthesizedExpression.js";
import { unwrapParenthesizedExpressionsParent } from "../utils/unwrapParentParenthesizedExpressions.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using chained assignment expressions (e.g., a = b = c).",
		id: "chainedAssignments",
		preset: "stylistic",
	},
	messages: {
		noChainedAssignment: {
			primary:
				"Prefer separate assignment statements for readability instead of chaining assignments.",
			secondary: [
				"Chained assignments can be hard to read and can lead to unexpected behavior with variable scoping and type inference.",
				"Each assignment creates a reference to the same value, which may cause confusion when dealing with mutable values.",
			],
			suggestions: [
				"Break the chained assignment into separate assignment statements, one for each variable.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				BinaryExpression: (node) => {
					if (!tsutils.isAssignmentKind(node.operatorToken.kind)) {
						return;
					}

					const rightSide = unwrapParenthesizedExpression(node.right);
					if (
						!ts.isBinaryExpression(rightSide) ||
						!tsutils.isAssignmentKind(rightSide.operatorToken.kind)
					) {
						return;
					}

					const parent = unwrapParenthesizedExpressionsParent(node);
					if (ts.isBinaryExpression(parent)) {
						return;
					}

					context.report({
						message: "noChainedAssignment",
						range: getTSNodeRange(node.operatorToken, context.sourceFile),
					});
				},
			},
		};
	},
});
