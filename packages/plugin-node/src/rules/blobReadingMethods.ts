import {
	getTSNodeRange,
	isGlobalDeclaration,
	typescriptLanguage,
} from "@flint.fyi/ts";
import * as ts from "typescript";

const blobReadingMethods = new Set(["arrayBuffer", "bytes", "text"]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer direct Blob reading methods over wrapping in Response for simpler code.",
		id: "blobReadingMethods",
		preset: "stylistic",
	},
	messages: {
		preferBlobMethod: {
			primary:
				"Prefer `blob.{{ method }}()` over `new Response(blob).{{ method }}()`.",
			secondary: [
				"Direct Blob methods are simpler and more direct than wrapping the Blob in a Response object.",
				"The Response wrapper adds unnecessary complexity when the Blob already provides the needed methods.",
			],
			suggestions: [
				"Use `blob.{{ method }}()` instead of wrapping in Response.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression(node: ts.CallExpression, { sourceFile, typeChecker }) {
					if (
						!ts.isPropertyAccessExpression(node.expression) ||
						!ts.isIdentifier(node.expression.name)
					) {
						return;
					}

					const receiver = node.expression.expression;
					if (
						!ts.isNewExpression(receiver) ||
						!ts.isIdentifier(receiver.expression) ||
						receiver.expression.text !== "Response" ||
						!receiver.arguments ||
						receiver.arguments.length === 0
					) {
						return;
					}

					const methodName = node.expression.name.text;
					if (
						!blobReadingMethods.has(methodName) ||
						!isGlobalDeclaration(receiver.expression, typeChecker)
					) {
						return;
					}

					context.report({
						data: { method: methodName },
						message: "preferBlobMethod",
						range: getTSNodeRange(node, sourceFile),
					});
				},
			},
		};
	},
});
