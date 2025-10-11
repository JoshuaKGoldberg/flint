import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports control flow statements in finally blocks that can override control flow in try/catch blocks.",
		id: "unsafeFinallyStatements",
		preset: "logical",
	},
	messages: {
		unsafeFinally: {
			primary:
				"Avoid using control flow statements in finally blocks, as they can override control flow from try/catch blocks.",
			secondary: [
				"Control flow statements like return, throw, break, and continue in finally blocks can override control flow statements in the try or catch blocks.",
				"This can lead to unexpected behavior, as the finally block will execute regardless of what happens in try/catch, and its control flow takes precedence.",
			],
			suggestions: [
				"Move the control flow statement out of the finally block or remove it if the finally block is only used for cleanup operations.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				TryStatement: (node) => {
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
							const firstToken = statement.getFirstToken(context.sourceFile);
							if (!firstToken) {
								return;
							}

							const range = {
								begin: statement.getStart(context.sourceFile),
								end:
									statement.getStart(context.sourceFile) +
									firstToken.getText().length,
							};

							context.report({
								message: "unsafeFinally",
								range,
							});
						}

						if (ts.isBlock(statement)) {
							statement.statements.forEach(checkStatement);
						} else if (ts.isIfStatement(statement)) {
							checkStatement(statement.thenStatement);
							if (statement.elseStatement) {
								checkStatement(statement.elseStatement);
							}
						} else if (
							ts.isWhileStatement(statement) ||
							ts.isDoStatement(statement)
						) {
							checkStatement(statement.statement);
						} else if (
							ts.isForStatement(statement) ||
							ts.isForInStatement(statement) ||
							ts.isForOfStatement(statement)
						) {
							checkStatement(statement.statement);
						} else if (ts.isSwitchStatement(statement)) {
							statement.caseBlock.clauses.forEach((clause) => {
								clause.statements.forEach(checkStatement);
							});
						} else if (ts.isLabeledStatement(statement)) {
							checkStatement(statement.statement);
						} else if (ts.isTryStatement(statement)) {
							checkStatement(statement.tryBlock);
							if (statement.catchClause) {
								checkStatement(statement.catchClause.block);
							}
							if (statement.finallyBlock) {
								checkStatement(statement.finallyBlock);
							}
						}
					}

					checkStatement(node.finallyBlock);
				},
			},
		};
	},
});
