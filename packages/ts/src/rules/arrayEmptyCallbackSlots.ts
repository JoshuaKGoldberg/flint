import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";
import { isGlobalDeclarationOfName } from "../utils/isGlobalDeclarationOfName.ts";

function hasCallbackArgument(callExpression: ts.CallExpression): boolean {
	const firstArg = callExpression.arguments[0];
	if (!firstArg) {
		return false;
	}

	return (
		ts.isFunctionExpression(firstArg) ||
		ts.isArrowFunction(firstArg) ||
		(ts.isIdentifier(firstArg) && firstArg.text !== "undefined")
	);
}

function isNumericLiteral(node: ts.Expression): boolean {
	if (ts.isNumericLiteral(node)) {
		return true;
	}

	if (ts.isPrefixUnaryExpression(node)) {
		return (
			(node.operator === ts.SyntaxKind.PlusToken ||
				node.operator === ts.SyntaxKind.MinusToken) &&
			ts.isNumericLiteral(node.operand)
		);
	}

	return false;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports array methods with callbacks that will never be invoked on arrays with empty slots.",
		id: "arrayEmptyCallbackSlots",
		preset: "logical",
	},
	messages: {
		uninvokedCallback: {
			primary: "This callback will not be invoked.",
			secondary: [
				"When the Array constructor is called with a single number argument, it creates an array with empty slots (not actual undefined values).",
				"Callback methods like `map`, `filter`, `forEach`, etc. skip empty slots, so the callback will never run.",
			],
			suggestions: [
				"Use `Array.from({ length: n }, callback)` instead.",
				"Use `new Array(n).fill(undefined).map(callback)` to fill slots first.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { sourceFile, typeChecker }) => {
					if (!ts.isPropertyAccessExpression(node.expression)) {
						return;
					}

					const memberExpression = node.expression;
					const objectExpression = memberExpression.expression;

					if (!ts.isNewExpression(objectExpression)) {
						return;
					}

					if (
						!ts.isIdentifier(objectExpression.expression) ||
						!isGlobalDeclarationOfName(
							objectExpression.expression,
							"Array",
							typeChecker,
						)
					) {
						return;
					}

					const args = objectExpression.arguments;
					if (args?.length !== 1) {
						return;
					}

					const firstArg = args[0];
					if (!firstArg || !isNumericLiteral(firstArg)) {
						return;
					}

					if (!hasCallbackArgument(node)) {
						return;
					}

					context.report({
						message: "uninvokedCallback",
						range: getTSNodeRange(memberExpression.name, sourceFile),
					});
				},
			},
		};
	},
});
