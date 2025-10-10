import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports switch statements with duplicate case clause test expressions.",
		id: "caseDuplicates",
		preset: "logical",
	},
	messages: {
		duplicateCase: {
			primary:
				"Duplicate case label. A case with an identical test expression exists.",
			secondary: [
				"Having duplicate case clauses in a switch statement is a logic error.",
				"The second case clause will never be reached because the first matching case will always execute first.",
			],
			suggestions: [
				"Remove the duplicate case clause or modify its test expression to be unique.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				SwitchStatement: (node) => {
					const seenCaseTexts = new Set<string>();

					for (const clause of node.caseBlock.clauses) {
						if (!ts.isCaseClause(clause)) {
							continue;
						}

						const caseText = clause.expression.getText(context.sourceFile);

						if (seenCaseTexts.has(caseText)) {
							context.report({
								message: "duplicateCase",
								range: {
									begin: clause.getStart(context.sourceFile),
									end: clause.expression.getEnd(),
								},
							});
						} else {
							seenCaseTexts.add(caseText);
						}
					}
				},
			},
		};
	},
});
