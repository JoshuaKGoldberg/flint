import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import {
	type TypeScriptFileServices,
	typescriptLanguage,
} from "../language.ts";
import type * as AST from "../types/ast.ts";
import type { Checker } from "../types/checker.ts";

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
				| AST.ArrowFunction
				| AST.FunctionDeclaration
				| AST.FunctionExpression
				| AST.MethodDeclaration,
			{ sourceFile, typeChecker }: TypeScriptFileServices,
		) {
			if (
				!node.body ||
				(ts.isBlock(node.body) && node.body.statements.length === 0)
			) {
				return;
			}

			const asyncModifier = node.modifiers?.find(
				(modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword,
			);

			if (
				!asyncModifier ||
				bodyContainsAwait(node.body) ||
				returnsThenable(node, typeChecker)
			) {
				return;
			}

			context.report({
				message: "missingAwait",
				range: getTSNodeRange(asyncModifier, sourceFile),
			});
		}
	},
});

type FunctionLikeNode =
	| AST.ArrowFunction
	| AST.FunctionDeclaration
	| AST.FunctionExpression
	| AST.MethodDeclaration;

function blockReturnsThenable(block: AST.Block, typeChecker: Checker): boolean {
	function checkNode(node: ts.Node): boolean | undefined {
		if (ts.isReturnStatement(node) && node.expression) {
			const type = typeChecker.getTypeAtLocation(node.expression);
			if (tsutils.isThenableType(typeChecker, node.expression, type)) {
				return true;
			}
		}

		// Don't descend into nested functions
		if (tsutils.isFunctionScopeBoundary(node)) {
			return false;
		}

		return ts.forEachChild(node, checkNode);
	}

	return checkNode(block) ?? false;
}

function bodyContainsAwait(body: AST.Block | AST.Expression) {
	function checkForAwait(node: ts.Node): boolean | undefined {
		if (
			ts.isAwaitExpression(node) ||
			(ts.isForOfStatement(node) && node.awaitModifier)
		) {
			return true;
		}

		// Check for 'await using' declarations
		if (ts.isVariableStatement(node)) {
			const flags = node.declarationList.flags as number;
			const awaitUsingFlags = ts.NodeFlags.AwaitUsing as number;
			// AwaitUsing is a composite flag (Using | Const), so we need to check all bits are set
			if ((flags & awaitUsingFlags) === awaitUsingFlags) {
				return true;
			}
		}

		if (tsutils.isFunctionScopeBoundary(node)) {
			return false;
		}

		return ts.forEachChild(node, checkForAwait);
	}

	return checkForAwait(body);
}

function returnsThenable(
	node: FunctionLikeNode,
	typeChecker: Checker,
): boolean {
	// For arrow functions with expression body, check if the expression is thenable
	if (ts.isArrowFunction(node) && !ts.isBlock(node.body)) {
		const type = typeChecker.getTypeAtLocation(node.body);
		if (tsutils.isThenableType(typeChecker, node.body, type)) {
			return true;
		}
	}

	// For block bodies, check if any return statement returns a thenable
	if (node.body && ts.isBlock(node.body)) {
		return blockReturnsThenable(node.body, typeChecker);
	}

	return false;
}
