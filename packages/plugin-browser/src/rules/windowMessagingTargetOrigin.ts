import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import { isGlobalVariable } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Requires specifying the targetOrigin argument when calling window.postMessage().",
		id: "windowMessagingTargetOrigin",
		preset: "logical",
	},
	messages: {
		missingTargetOrigin: {
			primary:
				"The `postMessage()` call is missing the required `targetOrigin` argument.",
			secondary: [
				"Calling window.postMessage() without a targetOrigin argument prevents the message from being received by any window.",
				"Always specify a target origin (for example, 'https://example.com' or '*' for any origin) as the second argument.",
			],
			suggestions: [
				"Add a targetOrigin as the second argument (e.g., window.postMessage(message, 'https://example.com'))",
			],
		},
	},
	setup(context) {
		function isWindowLikeIdentifier(node: ts.Expression): boolean {
			if (!ts.isIdentifier(node)) {
				return false;
			}

			const name = node.text;
			return (
				(name === "window" ||
					name === "self" ||
					name === "globalThis" ||
					name === "parent" ||
					name === "top") &&
				isGlobalVariable(node, context.typeChecker)
			);
		}

		return {
			visitors: {
				CallExpression(node: ts.CallExpression) {
					const { arguments: args, expression } = node;

					// Check if this is a property access like window.postMessage
					if (!ts.isPropertyAccessExpression(expression)) {
						return;
					}

					const { expression: object, name } = expression;

					// Check if the method name is postMessage
					if (!ts.isIdentifier(name) || name.text !== "postMessage") {
						return;
					}

					// Check if the object is a window-like global
					if (!isWindowLikeIdentifier(object)) {
						return;
					}

					// Check if targetOrigin argument is missing (less than 2 arguments)
					if (args.length < 2) {
						context.report({
							message: "missingTargetOrigin",
							range: getTSNodeRange(name, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
