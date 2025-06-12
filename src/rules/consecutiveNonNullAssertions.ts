import * as ts from "typescript";

import { createRule } from "../createRule.js";

export default createRule({
	about: {
		id: "consecutiveNonNullAssertions",
		preset: "logical",
	},
	messages: {
		consecutiveNonNullAssertion:
			"Consecutive non-null assertion operators are unnecessary.",
	},
	setup(context) {
		return {
			NonNullExpression(node) {
				if (node.parent.kind === ts.SyntaxKind.NonNullExpression) {
					context.report({
						message: "consecutiveNonNullAssertion",
						range: {
							begin: node.end,
							end: node.parent.end + 1,
						},
					});
				}
			},
		};
	},
});
