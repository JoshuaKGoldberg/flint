import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

function isSameIdentifier(left: ts.Expression, right: ts.Expression): boolean {
	if (ts.isIdentifier(left) && ts.isIdentifier(right)) {
		return left.text === right.text;
	}
	return false;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports self-assignments which have no effect and are likely errors.",
		id: "selfAssignments",
		preset: "logical",
	},
	messages: {
		selfAssignment: {
			primary: "Self-assignment detected.",
			secondary: [
				"Self-assignments have no effect and typically indicate an incomplete refactoring or copy-paste error.",
				"The same variable is being assigned to itself, which does nothing.",
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

					if (isSameIdentifier(node.left, node.right)) {
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
