import * as ts from "typescript";

import { createRule } from "../createRule.js";

export default createRule({
	about: {
		id: "consecutiveNonNullAssertions",
		preset: "logical",
	},
	messages: {
		consecutiveNonNullAssertion:
			"Unnecessary consecutive non-null assertion operator.",
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
