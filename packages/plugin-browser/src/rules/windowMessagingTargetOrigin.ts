import { runtimeBase } from "@flint.fyi/core";
import {
	getTSNodeRange,
	typescriptLanguage,
	type TypeScriptServices,
} from "@flint.fyi/ts";
import { isGlobalVariable } from "@flint.fyi/ts";
import * as ts from "typescript";

const windowLikeNames = new Set([
	"globalThis",
	"parent",
	"self",
	"top",
	"window",
]);

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
				"This `postMessage()` call is missing the required `targetOrigin` argument.",
			secondary: [
				"Calling window.postMessage() without a targetOrigin argument prevents the message from being received by any window.",
				"Always specify a target origin (for example, 'https://example.com' or '*' for any origin) as the second argument.",
			],
			suggestions: [
				"Add a targetOrigin as the second argument (e.g., window.postMessage(message, 'https://example.com'))",
			],
		},
	},
	setup() {
		return {
			...runtimeBase,
			visitors: {
				CallExpression(node, context) {
					if (
						node.arguments.length < 2 &&
						ts.isPropertyAccessExpression(node.expression) &&
						ts.isIdentifier(node.expression.name) &&
						node.expression.name.text === "postMessage" &&
						isWindowLikeIdentifier(node.expression.expression, context)
					) {
						context.report({
							message: "missingTargetOrigin",
							range: getTSNodeRange(node.expression.name, context.sourceFile),
						});
					}
				},
			},
		};
	},
});

function isWindowLikeIdentifier(
	node: ts.Expression,
	context: TypeScriptServices,
): boolean {
	return (
		ts.isIdentifier(node) &&
		windowLikeNames.has(node.text) &&
		isGlobalVariable(node, context.typeChecker)
	);
}
