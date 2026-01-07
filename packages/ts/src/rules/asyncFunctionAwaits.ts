import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import {
	type TypeScriptFileServices,
	typescriptLanguage,
} from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports async functions that do not use await.",
		id: "asyncFunctionAwaits",
		preset: "logical",
	},
	messages: {
		missingAwait: {
			primary:
				"Async functions should contain an await expression or return a Promise.",
			secondary: [
				"Async functions always wrap their return value in a Promise, which adds overhead if you're not using await.",
				"This may indicate incomplete implementation or leftover code after refactoring.",
			],
			suggestions: [
				"Add an `await` expression if you need to wait for asynchronous operations.",
				"Remove the `async` keyword if the function doesn't need to be asynchronous.",
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
			{ sourceFile, typeChecker }: TypeScriptFileServices,
		) {
			const asyncModifier = node.modifiers?.find(
				(mod) => mod.kind === ts.SyntaxKind.AsyncKeyword,
			);

			if (!asyncModifier) {
				return;
			}

			if (node.asteriskToken) {
				return;
			}

			if (!node.body) {
				return;
			}

			if (isEmptyBody(node.body)) {
				return;
			}

			if (bodyContainsAwait(node.body)) {
				return;
			}

			if (bodyReturnsThenable(node.body, typeChecker)) {
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

	return ts.forEachChild(body, checkForAwait);
}

function bodyReturnsThenable(
	body: ts.Block | ts.Expression,
	typeChecker: ts.TypeChecker,
) {
	if (!ts.isBlock(body)) {
		return isThenable(body, typeChecker);
	}

	function checkReturnStatements(node: ts.Node): boolean | undefined {
		if (ts.isReturnStatement(node) && node.expression) {
			if (isThenable(node.expression, typeChecker)) {
				return true;
			}
		}

		if (tsutils.isFunctionScopeBoundary(node)) {
			return false;
		}

		return ts.forEachChild(node, checkReturnStatements);
	}

	return ts.forEachChild(body, checkReturnStatements);
}

function isEmptyBody(body: ts.Block | ts.Expression) {
	if (!ts.isBlock(body)) {
		return false;
	}

	return body.statements.length === 0;
}

function isThenable(node: ts.Expression, typeChecker: ts.TypeChecker) {
	const type = typeChecker.getTypeAtLocation(node);
	const thenProperty = type.getProperty("then");

	if (!thenProperty) {
		return false;
	}

	const thenType = typeChecker.getTypeOfSymbol(thenProperty);
	const callSignatures = thenType.getCallSignatures();

	return callSignatures.length > 0;
}
