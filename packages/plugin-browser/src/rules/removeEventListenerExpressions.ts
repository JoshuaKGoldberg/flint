import {
	getTSNodeRange,
	isGlobalDeclaration,
	typescriptLanguage,
} from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallow inline function expressions in removeEventListener calls.",
		id: "removeEventListenerExpressions",
		preset: "logical",
	},
	messages: {
		invalidRemoveEventListener: {
			primary:
				"Inline function expressions in `removeEventListener` calls will not remove the original listener.",
			secondary: [
				"The removeEventListener method requires the exact same function reference that was passed to addEventListener.",
				"Inline arrow functions and function expressions create new function instances each time, so they cannot match the original listener.",
				"Store the listener in a variable and use that reference for both addEventListener and removeEventListener.",
			],
			suggestions: [
				"Store the listener function in a variable",
				"Use the same function reference that was passed to addEventListener",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression(node: ts.CallExpression) {
					if (!ts.isPropertyAccessExpression(node.expression)) {
						return;
					}

					if (
						!ts.isIdentifier(node.expression.name) ||
						node.expression.name.text !== "removeEventListener" ||
						node.arguments.length < 2 ||
						!isGlobalDeclaration(node.expression, context.typeChecker)
					) {
						return;
					}

					const listener = node.arguments[1];
					if (
						!ts.isArrowFunction(listener) &&
						!ts.isFunctionExpression(listener)
					) {
						return;
					}

					context.report({
						message: "invalidRemoveEventListener",
						range: getTSNodeRange(listener, context.sourceFile),
					});
				},
			},
		};
	},
});
