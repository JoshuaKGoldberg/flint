import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import { isGlobalDeclaration } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports uses of `document.cookie` which can be error-prone and has security implications.",
		id: "documentCookies",
		preset: "logical",
	},
	messages: {
		noCookie: {
			primary:
				"Direct use of `document.cookie` is error-prone and has security implications.",
			secondary: [
				"Reading and writing cookies through document.cookie requires manual string parsing and formatting, which is error-prone.",
				"Cookie operations should be performed through dedicated libraries or browser APIs that handle encoding, expiration, and security properly.",
			],
			suggestions: [
				"Use a cookie management library or the modern Cookie Store API instead.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				PropertyAccessExpression(node: ts.PropertyAccessExpression) {
					if (
						ts.isIdentifier(node.name) &&
						node.name.text === "cookie" &&
						ts.isIdentifier(node.expression) &&
						node.expression.text === "document" &&
						isGlobalDeclaration(node.expression, context.typeChecker)
					) {
						context.report({
							message: "noCookie",
							range: getTSNodeRange(node.name, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
