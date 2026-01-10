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
				returnsThenable(node, typeChecker) ||
				isAsyncGeneratorWithThenableYield(node, typeChecker)
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

function blockReturnsThenable(block: AST.Block, typeChecker: Checker) {
	function checkForThenable(node: ts.Node): boolean | undefined {
		if (ts.isReturnStatement(node) && node.expression) {
			const type = typeChecker.getTypeAtLocation(node.expression);
			if (tsutils.isThenableType(typeChecker, node.expression, type)) {
				return true;
			}
		}

		return (
			!tsutils.isFunctionScopeBoundary(node) &&
			ts.forEachChild(node, checkForThenable)
		);
	}

	return checkForThenable(block) ?? false;
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

		return (
			!tsutils.isFunctionScopeBoundary(node) &&
			ts.forEachChild(node, checkForAwait)
		);
	}

	return checkForAwait(body);
}

function isAsyncGeneratorWithThenableYield(
	node: FunctionLikeNode,
	typeChecker: Checker,
) {
	if (!node.asteriskToken || !node.body || !ts.isBlock(node.body)) {
		return false;
	}

	function checkForThenableYield(child: ts.Node): boolean | undefined {
		if (ts.isYieldExpression(child)) {
			if (child.asteriskToken && child.expression) {
				// yield* - check if delegating to an AsyncIterable
				const type = typeChecker.getTypeAtLocation(child.expression);
				if (isAsyncIterable(type, typeChecker)) {
					return true;
				}
			} else if (child.expression) {
				// yield value - check if the value is thenable
				const type = typeChecker.getTypeAtLocation(child.expression);
				if (tsutils.isThenableType(typeChecker, child.expression, type)) {
					return true;
				}
			}
		}

		return (
			!tsutils.isFunctionScopeBoundary(child) &&
			ts.forEachChild(child, checkForThenableYield)
		);
	}

	return checkForThenableYield(node.body);
}

function isAsyncIterable(type: ts.Type, typeChecker: Checker): boolean {
	for (const part of tsutils.typeConstituents(type)) {
		const symbol = part.getSymbol();
		if (
			symbol?.getName() === "AsyncIterable" ||
			symbol?.getName() === "AsyncIterableIterator" ||
			symbol?.getName() === "AsyncGenerator"
		) {
			return true;
		}
		// Check if it has Symbol.asyncIterator
		const asyncIteratorSymbol = typeChecker.getPropertyOfType(
			part,
			"__@asyncIterator@" as string,
		);
		if (asyncIteratorSymbol) {
			return true;
		}
	}
	return false;
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
	return !!(
		node.body &&
		ts.isBlock(node.body) &&
		blockReturnsThenable(node.body, typeChecker)
	);
}
