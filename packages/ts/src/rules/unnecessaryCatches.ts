import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports catch clauses that only rethrow the caught error without modification.",
		id: "unnecessaryCatches",
		preset: "logical",
	},
	messages: {
		unnecessaryCatch: {
			primary:
				"This catch clause is unnecessary, as it only rethrows the exception without modification.",
			secondary: [
				"A catch clause that only rethrows the caught error adds no value and creates unnecessary code complexity.",
				"Removing such catch clauses allows errors to propagate naturally without the overhead of an unnecessary try-catch block.",
			],
			suggestions: [
				"Remove the try-catch block if the catch clause only rethrows the error, or add meaningful error handling logic to the catch clause.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CatchClause: (node) => {
					if (!node.variableDeclaration || !ts.isBlock(node.block)) {
						return;
					}

					const statements = node.block.statements;

					if (statements.length !== 1) {
						return;
					}

					const statement = statements[0];

					if (!ts.isThrowStatement(statement)) {
						return;
					}

					const catchVariable = node.variableDeclaration.name;
					const thrownExpression = statement.expression;

					if (
						!ts.isIdentifier(catchVariable) ||
						!ts.isIdentifier(thrownExpression)
					) {
						return;
					}

					if (catchVariable.text !== thrownExpression.text) {
						return;
					}

					const tryStatement = node.parent;
					if (!ts.isTryStatement(tryStatement)) {
						return;
					}

					const range = {
						begin: node.getStart(context.sourceFile),
						end: node.getStart(context.sourceFile) + "catch".length,
					};

					context.report({
						fix: {
							range: {
								begin: tryStatement.tryBlock.getEnd(),
								end: node.getEnd(),
							},
							text: "",
						},
						message: "unnecessaryCatch",
						range,
					});
				},
			},
		};
	},
});
