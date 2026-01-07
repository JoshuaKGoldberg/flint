import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import {
	type TypeScriptFileServices,
	typescriptLanguage,
} from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports async functions that do not use await expressions.",
		id: "asyncFunctionAwaits",
		preset: "logical",
	},
	messages: {
		missingAwait: {
			primary: "Async functions should contain at least one await expression.",
			secondary: [
				"Async functions return a Promise implicitly and allow use of the `await` operator.",
				"Without an await expression, the function gains no benefit from being async and may indicate incomplete implementation or refactoring.",
			],
			suggestions: [
				"Add an `await` expression to pause execution until a Promise resolves.",
				"If the function does not need to await any values, remove the `async` keyword.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				ArrowFunction: checkFunction,
				FunctionDeclaration: checkFunction,
				FunctionExpression: checkFunction,
				MethodDeclaration: checkFunction,
			},
		};

		function checkFunction(
			node:
				| ts.ArrowFunction
				| ts.FunctionDeclaration
				| ts.FunctionExpression
				| ts.MethodDeclaration,
			{ sourceFile }: TypeScriptFileServices,
		): void {
			const asyncModifier = node.modifiers?.find(
				(modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword,
			);

			if (!asyncModifier || !node.body) {
				return;
			}

			if (bodyContainsAwait(node.body)) {
				return;
			}

			context.report({
				message: "missingAwait",
				range: {
					begin: asyncModifier.getStart(sourceFile),
					end: asyncModifier.getEnd(),
				},
			});
		}
	},
});

function bodyContainsAwait(body: ts.Block | ts.Expression) {
	function checkForAwait(node: ts.Node): boolean | undefined {
		if (ts.isAwaitExpression(node)) {
			return true;
		}

		if (ts.isForOfStatement(node) && node.awaitModifier) {
			return true;
		}

		if (tsutils.isFunctionScopeBoundary(node)) {
			return false;
		}

		return ts.forEachChild(node, checkForAwait);
	}

	return checkForAwait(body);
}
