import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports for-in loops that iterate over objects without a filtering condition.",
		id: "guardedForIns",
		preset: "untyped",
	},
	messages: {
		guardForIn: {
			primary:
				"For-in loops should be guarded with a filtering condition to avoid iterating over inherited properties.",
			secondary: [
				"A for-in loop iterates over all enumerable properties of an object, including those inherited from its prototype chain.",
				"Without a filtering condition (such as `hasOwnProperty`), the loop may process properties you did not intend to include.",
				"This can lead to unexpected behavior when the object's prototype has been modified or when dealing with objects from external sources.",
			],
			suggestions: [
				"Add a filtering condition inside the loop body, such as `if (Object.hasOwn(obj, key))` or `if (obj.hasOwnProperty(key))`.",
				"Consider using `Object.keys(obj)`, `Object.entries(obj)`, or `Object.values(obj)` if you only need the object's own properties.",
			],
		},
	},
	setup(context) {
		function hasGuard(statement: ts.Statement): boolean {
			if (ts.isIfStatement(statement)) {
				return true;
			}

			if (ts.isBlock(statement)) {
				if (statement.statements.length === 0) {
					return false;
				}

				const firstStatement = statement.statements[0];
				return ts.isIfStatement(firstStatement);
			}

			return false;
		}

		return {
			visitors: {
				ForInStatement: (node) => {
					if (!hasGuard(node.statement)) {
						const sourceText = context.sourceFile.getText();
						const start = node.getStart(context.sourceFile);
						const statementStart = node.statement.getStart(context.sourceFile);

						const openBraceIndex = sourceText.indexOf("{", start);
						const end =
							openBraceIndex >= 0 && openBraceIndex < statementStart + 10
								? openBraceIndex
								: statementStart;

						context.report({
							message: "guardForIn",
							range: {
								begin: start,
								end,
							},
						});
					}
				},
			},
		};
	},
});
