import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports using await expressions inside loops.",
		id: "loopAwaits",
		preset: "logical",
	},
	messages: {
		noAwaitInLoop: {
			primary:
				"Using await inside loops causes sequential execution instead of parallel execution.",
			secondary: [
				"Each iteration of the loop will wait for the previous iteration to complete before starting.",
				"This can significantly slow down your code if the awaited operations could be done in parallel.",
			],
			suggestions: [
				"Consider collecting promises in an array and using `Promise.all()` to await them in parallel.",
			],
		},
	},
	setup(context) {
		function checkForAwaitExpressions(node: ts.Node, loopNode: ts.Node): void {
			if (ts.isAwaitExpression(node)) {
				const awaitKeyword = node.getChildAt(0, context.sourceFile);
				context.report({
					message: "noAwaitInLoop",
					range: {
						begin: awaitKeyword.getStart(context.sourceFile),
						end: awaitKeyword.getEnd(),
					},
				});
				return;
			}

			// Don't descend into nested loops or function boundaries
			if (
				node !== loopNode &&
				(ts.isForStatement(node) ||
					ts.isForInStatement(node) ||
					ts.isForOfStatement(node) ||
					ts.isWhileStatement(node) ||
					ts.isDoStatement(node) ||
					tsutils.isFunctionScopeBoundary(node))
			) {
				return;
			}

			ts.forEachChild(node, (child) => {
				checkForAwaitExpressions(child, loopNode);
			});
		}

		return {
			visitors: {
				DoStatement: (node) => {
					checkForAwaitExpressions(node.statement, node);
				},
				ForInStatement: (node) => {
					checkForAwaitExpressions(node.statement, node);
				},
				ForOfStatement: (node) => {
					checkForAwaitExpressions(node.statement, node);
				},
				ForStatement: (node) => {
					checkForAwaitExpressions(node.statement, node);
				},
				WhileStatement: (node) => {
					checkForAwaitExpressions(node.statement, node);
				},
			},
		};
	},
});
