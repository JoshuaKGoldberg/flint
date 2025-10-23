import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";
import { hasSameTokens } from "../utils/hasSameTokens.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports self-assignments which have no effect and are likely errors.",
		id: "selfAssignments",
		preset: "logical",
	},
	messages: {
		selfAssignment: {
			primary: "This value is being assigned to itself, which does nothing.",
			secondary: [
				"Self-assignments have no effect and typically indicate an incomplete refactoring or copy-paste error.",
			],
			suggestions: [
				"Review the assignment and ensure you're assigning the correct value.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				BinaryExpression: (node) => {
					if (
						node.operatorToken.kind !== ts.SyntaxKind.EqualsToken &&
						node.operatorToken.kind !==
							ts.SyntaxKind.AmpersandAmpersandEqualsToken &&
						node.operatorToken.kind !== ts.SyntaxKind.BarBarEqualsToken &&
						node.operatorToken.kind !==
							ts.SyntaxKind.QuestionQuestionEqualsToken
					) {
						return;
					}

					if (hasSameTokens(node.left, node.right, context.sourceFile)) {
						context.report({
							message: "selfAssignment",
							range: getTSNodeRange(node, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
