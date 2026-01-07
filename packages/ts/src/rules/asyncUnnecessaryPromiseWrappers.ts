import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports unnecessary Promise.resolve() or Promise.reject() in async contexts.",
		id: "asyncUnnecessaryPromiseWrappers",
		preset: "logical",
	},
	messages: {
		unnecessaryReject: {
			primary:
				"Errors can be thrown directly instead of wrapping in Promise.reject().",
			secondary: [
				"In async functions, thrown errors are automatically converted to rejected promises.",
				"Using Promise.reject() is unnecessary and less idiomatic.",
			],
			suggestions: [
				"Throw the error directly instead of using Promise.reject.",
			],
		},
		unnecessaryResolve: {
			primary:
				"Return values in async functions are already wrapped in a Promise.",
			secondary: [
				"Wrapping a value in Promise.resolve() is unnecessary in async functions.",
				"This adds extra code without changing the behavior.",
			],
			suggestions: ["Return the value directly instead of wrapping it."],
		},
	},
	setup(context) {
		return {
			visitors: {
				ArrowFunction: (node, { sourceFile }) => {
					if (!ts.isCallExpression(node.body)) {
						return;
					}

					const promiseMethod = getPromiseMethod(node.body);
					if (!promiseMethod) {
						return;
					}

					if (!isAsyncFunction(node)) {
						return;
					}

					context.report({
						message:
							promiseMethod === "reject"
								? "unnecessaryReject"
								: "unnecessaryResolve",
						range: {
							begin: node.body.getStart(sourceFile),
							end: node.body.getEnd(),
						},
					});
				},
			},
		};
	},
});

function getPromiseMethod(
	node: ts.CallExpression,
): "reject" | "resolve" | undefined {
	if (!ts.isPropertyAccessExpression(node.expression)) {
		return undefined;
	}

	const propertyAccess = node.expression;
	const methodName = propertyAccess.name.text;

	if (methodName !== "resolve" && methodName !== "reject") {
		return undefined;
	}

	if (!ts.isIdentifier(propertyAccess.expression)) {
		return undefined;
	}

	if (propertyAccess.expression.text !== "Promise") {
		return undefined;
	}

	return methodName;
}

function isAsyncFunction(node: ts.ArrowFunction) {
	return node.modifiers?.some((mod) => mod.kind === ts.SyntaxKind.AsyncKeyword);
}
