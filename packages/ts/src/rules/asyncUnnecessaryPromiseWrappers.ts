import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import {
	type TypeScriptFileServices,
	typescriptLanguage,
} from "../language.ts";
import { isGlobalDeclaration } from "../utils/isGlobalDeclaration.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports unnecessary Promise.resolve() or Promise.reject() in async functions or promise callbacks.",
		id: "asyncUnnecessaryPromiseWrappers",
		preset: "logical",
	},
	messages: {
		unnecessaryReject: {
			primary:
				"Prefer throwing the error directly instead of wrapping it with Promise.reject().",
			secondary: [
				"Thrown errors in async functions and promise callbacks are automatically caught and wrapped in a rejected Promise.",
				"Using Promise.reject() is redundant and adds unnecessary complexity.",
			],
			suggestions: [
				"Throw the error directly instead of wrapping it with Promise.reject().",
			],
		},
		unnecessaryResolve: {
			primary:
				"Prefer returning the value directly instead of wrapping it with Promise.resolve().",
			secondary: [
				"Return values in async functions and promise callbacks are automatically wrapped in a Promise.",
				"Using Promise.resolve() is redundant and adds unnecessary complexity.",
			],
			suggestions: [
				"Return the value directly instead of wrapping it with Promise.resolve().",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (
					node: ts.CallExpression,
					{ sourceFile, typeChecker }: TypeScriptFileServices,
				) => {
					if (!isPromiseResolveOrReject(node, typeChecker)) {
						return;
					}

					const containingFunction = getContainingFunction(node);
					if (!containingFunction) {
						return;
					}

					if (!isInAsyncOrPromiseContext(containingFunction, typeChecker)) {
						return;
					}

					const returnOrYield = getReturnOrYieldParent(
						node,
						containingFunction,
					);
					if (!returnOrYield) {
						return;
					}

					const methodName = getPromiseMethodName(node);
					const message =
						methodName === "reject"
							? "unnecessaryReject"
							: "unnecessaryResolve";

					context.report({
						message,
						range: {
							begin: node.expression.getStart(sourceFile),
							end: node.expression.getEnd(),
						},
					});
				},
			},
		};
	},
});

function getContainingFunction(
	node: ts.Node,
):
	| ts.ArrowFunction
	| ts.FunctionDeclaration
	| ts.FunctionExpression
	| ts.MethodDeclaration
	| undefined {
	let current = node.parent as ts.Node | undefined;
	while (current !== undefined) {
		if (tsutils.isFunctionScopeBoundary(current)) {
			return current as
				| ts.ArrowFunction
				| ts.FunctionDeclaration
				| ts.FunctionExpression
				| ts.MethodDeclaration;
		}
		current = current.parent as ts.Node | undefined;
	}
	return undefined;
}

function getPromiseMethodName(node: ts.CallExpression) {
	const propertyAccess = node.expression as ts.PropertyAccessExpression;
	return propertyAccess.name.text;
}

function getReturnOrYieldParent(
	node: ts.Node,
	containingFunction: ts.Node,
): ts.ReturnStatement | ts.YieldExpression | undefined {
	let current = node.parent as ts.Node | undefined;
	while (current !== undefined && current !== containingFunction) {
		if (ts.isReturnStatement(current)) {
			return current;
		}

		if (ts.isYieldExpression(current)) {
			return current;
		}

		if (ts.isArrowFunction(current) && current.body === node) {
			return undefined;
		}

		current = current.parent as ts.Node | undefined;
	}

	if (
		ts.isArrowFunction(containingFunction) &&
		!ts.isBlock(containingFunction.body) &&
		isDescendantOf(node, containingFunction.body)
	) {
		return {} as ts.ReturnStatement;
	}

	return undefined;
}

function isDescendantOf(node: ts.Node, ancestor: ts.Node): boolean {
	let current = node as ts.Node | undefined;
	while (current !== undefined) {
		if (current === ancestor) {
			return true;
		}
		current = current.parent as ts.Node | undefined;
	}
	return false;
}

function isInAsyncOrPromiseContext(
	func:
		| ts.ArrowFunction
		| ts.FunctionDeclaration
		| ts.FunctionExpression
		| ts.MethodDeclaration,
	typeChecker: ts.TypeChecker,
) {
	const asyncModifier = func.modifiers?.find(
		(modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword,
	);

	if (asyncModifier) {
		return true;
	}

	return isPromiseCallback(func, typeChecker);
}

function isPromiseCallback(
	func:
		| ts.ArrowFunction
		| ts.FunctionDeclaration
		| ts.FunctionExpression
		| ts.MethodDeclaration,
	typeChecker: ts.TypeChecker,
) {
	const parent = func.parent;

	if (!ts.isCallExpression(parent)) {
		return false;
	}

	if (!ts.isPropertyAccessExpression(parent.expression)) {
		return false;
	}

	const methodName = parent.expression.name.text;

	if (
		methodName !== "then" &&
		methodName !== "catch" &&
		methodName !== "finally"
	) {
		return false;
	}

	const callee = parent.expression.expression;
	const type = typeChecker.getTypeAtLocation(callee);
	const symbol = type.getSymbol();

	return symbol?.getName() === "Promise";
}

function isPromiseResolveOrReject(
	node: ts.CallExpression,
	typeChecker: ts.TypeChecker,
) {
	if (!ts.isPropertyAccessExpression(node.expression)) {
		return false;
	}

	const propertyAccess = node.expression;
	const methodName = propertyAccess.name.text;

	if (methodName !== "resolve" && methodName !== "reject") {
		return false;
	}

	if (!ts.isIdentifier(propertyAccess.expression)) {
		return false;
	}

	if (propertyAccess.expression.text !== "Promise") {
		return false;
	}

	return isGlobalDeclaration(propertyAccess.expression, typeChecker);
}
