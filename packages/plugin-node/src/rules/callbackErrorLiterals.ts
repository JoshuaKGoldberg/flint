import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

function isCallbackName(name: string): boolean {
	return name === "callback" || name === "cb" || name === "next" || name === "done";
}

function isLiteralButNotNullOrUndefined(node: ts.Expression): boolean {
	if (ts.isStringLiteral(node) || ts.isNumericLiteral(node) || ts.isRegularExpressionLiteral(node)) {
		return true;
	}

	if (node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword) {
		return true;
	}

	if (ts.isArrayLiteralExpression(node) || ts.isObjectLiteralExpression(node)) {
		return true;
	}

	if (ts.isTemplateLiteral(node)) {
		return true;
	}

	return false;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer Error instances over literal values when invoking error-first callbacks.",
		id: "callbackErrorLiterals",
		preset: "logical",
	},
	messages: {
		unexpectedLiteral: {
			primary:
				"Prefer passing an Error instance or null/undefined as the first argument to error-first callbacks, not a literal value.",
			secondary: [
				"Node.js error-first callbacks expect either null/undefined when there's no error, or an Error instance when there is an error.",
				"Passing literal values like strings, numbers, or booleans makes error handling inconsistent and harder to debug.",
			],
			suggestions: [
				"Use `new Error(message)` to create proper error instances",
				"Use `null` or `undefined` when there is no error",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression(node: ts.CallExpression) {
					if (node.arguments.length === 0) {
						return;
					}

					let callbackName: string | undefined;

					if (ts.isIdentifier(node.expression)) {
						callbackName = node.expression.text;
					} else if (ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.name)) {
						callbackName = node.expression.name.text;
					}

					if (!callbackName || !isCallbackName(callbackName)) {
						return;
					}

					const firstArg = node.arguments[0];
					if (firstArg && isLiteralButNotNullOrUndefined(firstArg)) {
						context.report({
							message: "unexpectedLiteral",
							range: getTSNodeRange(firstArg, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
