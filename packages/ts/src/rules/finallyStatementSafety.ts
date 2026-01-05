import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports control flow statements in `finally` blocks that can override control flow in `try`/`catch` blocks.",
		id: "finallyStatementSafety",
		preset: "logical",
	},
	messages: {
		unsafeFinally: {
			primary:
				"Control flow statements in `finally` blocks misleadingly override control flow from `try`/`catch` blocks.",
			secondary: [
				"Control flow statements like `break`, `continue`, `return`, and `throw` in finally blocks can override control flow statements in the try or catch blocks.",
				"This can lead to unexpected behavior, as the `finally` block will execute regardless of what happens in `try`/`catch`, and its control flow takes precedence.",
			],
			suggestions: [
				"Move the control flow statement out of the `finally` block.",
				"Remove the control flow statement if the `finally` block is only used for cleanup operations.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				TryStatement: (node, { sourceFile }) => {
					if (!node.finallyBlock) {
						return;
					}

					function checkStatement(statement: ts.Statement): void {
						if (
							ts.isReturnStatement(statement) ||
							ts.isThrowStatement(statement) ||
							ts.isBreakStatement(statement) ||
							ts.isContinueStatement(statement)
						) {
							const firstToken = statement.getFirstToken(sourceFile);
							if (!firstToken) {
								return;
							}

							context.report({
								message: "unsafeFinally",
								range: {
									begin: statement.getStart(sourceFile),
									end:
										statement.getStart(sourceFile) +
										firstToken.getText().length,
								},
							});
						}

						if (ts.isBlock(statement)) {
							statement.statements.forEach(checkStatement);
						} else if (ts.isIfStatement(statement)) {
							checkStatement(statement.thenStatement);
							if (statement.elseStatement) {
								checkStatement(statement.elseStatement);
							}
						} else if (ts.isSwitchStatement(statement)) {
							statement.caseBlock.clauses.forEach((clause) => {
								clause.statements.forEach(checkStatement);
							});
						} else if (ts.isLabeledStatement(statement)) {
							checkStatement(statement.statement);
						}
					}

					checkStatement(node.finallyBlock);
				},
			},
		};
	},
});
