import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports attempting to delete variables with the delete operator.",
		id: "variableDeletions",
		preset: "untyped",
	},
	messages: {
		noDeleteVar: {
			primary: "Variables should not be deleted with the delete operator.",
			secondary: [
				"The delete operator is only meant to remove properties from objects, not variables.",
				"Attempting to delete a variable in strict mode will cause a syntax error.",
				"In non-strict mode, it will silently fail and return false without actually deleting the variable.",
			],
			suggestions: [
				"Remove the delete statement, or if you need to unset the value, assign undefined instead.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				DeleteExpression: (node) => {
					if (node.expression.kind === ts.SyntaxKind.Identifier) {
						context.report({
							message: "noDeleteVar",
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
