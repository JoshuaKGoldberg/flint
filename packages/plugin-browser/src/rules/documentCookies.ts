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
					const { expression, name } = node;
					if (
						!ts.isIdentifier(name) ||
						name.text !== "cookie" ||
						!ts.isIdentifier(expression) ||
						expression.text !== "document" ||
						!isGlobalDeclaration(expression, context.typeChecker)
					) {
						return;
					}

					context.report({
						message: "noCookie",
						range: getTSNodeRange(name, context.sourceFile),
					});
				},
			},
		};
	},
});
