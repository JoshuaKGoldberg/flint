import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";
import { unwrapParenthesizedExpression } from "../utils/unwrapParenthesizedExpression.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports using assignment expressions in return statements.",
		id: "returnAssignments",
		preset: "stylistic",
	},
	messages: {
		noReturnAssign: {
			primary: "Return statements should not contain assignment expressions.",
			secondary: [
				"Using assignments in return statements can make code harder to read and can lead to confusion about whether the assignment or the returned value is the primary intent.",
				"Assignment expressions return the assigned value, but mixing assignment with return makes the control flow less clear.",
			],
			suggestions: [
				"Perform the assignment on a separate line before the return statement.",
			],
		},
	},
	setup(context) {
		function checkForAssignment(node: ts.Expression): void {
			const unwrapped = unwrapParenthesizedExpression(node);

			if (
				ts.isBinaryExpression(unwrapped) &&
				tsutils.isAssignmentKind(unwrapped.operatorToken.kind)
			) {
				context.report({
					message: "noReturnAssign",
					range: getTSNodeRange(unwrapped.operatorToken, context.sourceFile),
				});
			}
		}

		return {
			visitors: {
				ReturnStatement: (node) => {
					if (!node.expression) {
						return;
					}

					checkForAssignment(node.expression);
				},
				ArrowFunction: (node) => {
					if (ts.isBlock(node.body)) {
						return;
					}

					checkForAssignment(node.body);
				},
			},
		};
	},
});
