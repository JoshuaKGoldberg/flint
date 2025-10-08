import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports switch statements where the default clause is not last.",
		id: "defaultCaseLast",
		preset: "logical",
	},
	messages: {
		defaultCaseShouldBeLast: {
			primary: "Default clauses in switch statements should be last.",
			secondary: [
				"Placing the default clause in a position other than last can lead to confusion and unexpected behavior.",
				"While the default clause is executed when no case matches, having it in the middle of other cases makes the control flow harder to follow.",
			],
			suggestions: [
				"Move the default clause to the end of the switch statement to improve code clarity.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				SwitchStatement: (node) => {
					if (!node.caseBlock.clauses.length) {
						return;
					}

					const clauses = node.caseBlock.clauses;
					const defaultClauseIndex = clauses.findIndex(
						(clause) => clause.kind === ts.SyntaxKind.DefaultClause,
					);

					if (defaultClauseIndex === -1) {
						return;
					}

					const isLast = defaultClauseIndex === clauses.length - 1;

					if (!isLast) {
						const defaultClause = clauses[defaultClauseIndex];

						context.report({
							message: "defaultCaseShouldBeLast",
							range: {
								begin: defaultClause.getStart(context.sourceFile),
								end:
									defaultClause.getStart(context.sourceFile) + "default".length,
							},
						});
					}
				},
			},
		};
	},
});
