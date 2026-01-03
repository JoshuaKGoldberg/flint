import { typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

import { isDeclaredInNodeTypes } from "./utils/isDeclaredInNodeTypes.ts";

const consoleMethods = new Set([
	"assert",
	"count",
	"countReset",
	"debug",
	"dir",
	"dirxml",
	"error",
	"group",
	"groupCollapsed",
	"info",
	"log",
	"table",
	"time",
	"timeEnd",
	"timeLog",
	"trace",
	"warn",
]);

function isConsoleMethodCall(node: ts.Expression, typeChecker: ts.TypeChecker) {
	return (
		ts.isPropertyAccessExpression(node) &&
		ts.isIdentifier(node.expression) &&
		node.expression.text === "console" &&
		ts.isIdentifier(node.name) &&
		consoleMethods.has(node.name.text) &&
		isDeclaredInNodeTypes(node.expression, typeChecker)
	);
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallow leading or trailing spaces in console method string arguments.",
		id: "consoleSpaces",
		preset: "stylistic",
	},
	messages: {
		leading: {
			primary:
				"This leading space is unnecessary as Node.js console outputs already include spaces.",
			secondary: [
				"Leading spaces in console output are often unintentional and can make debugging harder.",
				"Use separate arguments instead, which will be automatically spaced by console methods.",
			],
			suggestions: ["Remove the leading space from the string literal"],
		},
		trailing: {
			primary:
				"This trailing space is unnecessary as Node.js console outputs already include spaces.",
			secondary: [
				"Trailing spaces in console output are often unintentional and can make debugging harder.",
				"Use separate arguments instead, which will be automatically spaced by console methods.",
			],
			suggestions: ["Remove the trailing space from the string literal"],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression(node: ts.CallExpression, { sourceFile, typeChecker }) {
					if (!isConsoleMethodCall(node.expression, typeChecker)) {
						return;
					}

					for (let i = 0; i < node.arguments.length; i++) {
						const argument = node.arguments[i];
						if (!ts.isStringLiteral(argument) || argument.text.length === 0) {
							continue;
						}

						const startSpaces = /^(\s+)/.exec(argument.text);
						if (startSpaces && i !== 0) {
							const start = argument.getStart(sourceFile);
							context.report({
								message: "leading",
								range: {
									begin: start + 1,
									end: start + startSpaces[1].length + 1,
								},
							});
						}

						const endSpaces = /(\s+)$/.exec(argument.text);
						if (endSpaces) {
							const end = node.getEnd();
							context.report({
								message: "trailing",
								range: {
									begin: end - endSpaces[1].length - 2,
									end: end - 2,
								},
							});
						}
					}
				},
			},
		};
	},
});
