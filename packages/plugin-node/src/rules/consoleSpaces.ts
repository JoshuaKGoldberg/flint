import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

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

function isConsoleMethodCall(node: ts.Expression) {
	return (
		ts.isPropertyAccessExpression(node) &&
		ts.isIdentifier(node.expression) &&
		node.expression.text === "console" &&
		ts.isIdentifier(node.name) &&
		consoleMethods.has(node.name.text)
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
		leadingSpace: {
			primary:
				"This leading space is unnecessary as Node.js console outputs already include spaces.",
			secondary: [
				"Leading spaces in console output are often unintentional and can make debugging harder.",
				"Use separate arguments instead, which will be automatically spaced by console methods.",
			],
			suggestions: ["Remove the leading space from the string literal"],
		},
		trailingSpace: {
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
				CallExpression(node: ts.CallExpression) {
					if (!isConsoleMethodCall(node.expression)) {
						return;
					}

					// TODO: Add check to distinguish Node.js console from user-defined variables
					// For now, all identifiers named 'console' will be checked

					for (let i = 0; i < node.arguments.length; i++) {
						const argument = node.arguments[i];
						if (!ts.isStringLiteral(argument) || argument.text.length === 0) {
							continue;
						}

						const hasLeading = argument.text.startsWith(" ");
						const hasTrailing = argument.text.endsWith(" ");

						if (hasLeading && i !== 0) {
							context.report({
								message: "leadingSpace",
								range: getTSNodeRange(argument, context.sourceFile),
							});
						}

						if (hasTrailing) {
							context.report({
								message: "trailingSpace",
								range: getTSNodeRange(argument, context.sourceFile),
							});
						}
					}
				},
			},
		};
	},
});
