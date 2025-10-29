import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const CONSOLE_METHODS = new Set([
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
					// Check if it's a property access (console.log)
					if (!ts.isPropertyAccessExpression(node.expression)) {
						return;
					}

					// Check if the object is an identifier named "console"
					if (
						!ts.isIdentifier(node.expression.expression) ||
						node.expression.expression.text !== "console"
					) {
						return;
					}

					// Check if the method name is one of our console methods
					if (
						!ts.isIdentifier(node.expression.name) ||
						!CONSOLE_METHODS.has(node.expression.name.text)
					) {
						return;
					}

					// TODO: Add check to distinguish Node.js console from user-defined variables
					// For now, all identifiers named 'console' will be checked

					// Check each argument
					for (let i = 0; i < node.arguments.length; i++) {
						const argument = node.arguments[i];

						// Only check string literals
						if (!ts.isStringLiteral(argument)) {
							continue;
						}

						const text = argument.text;

						// Skip empty strings
						if (text.length === 0) {
							continue;
						}

						const hasLeading = text.startsWith(" ");
						const hasTrailing = text.endsWith(" ");

						// Allow multiple leading spaces in the first argument for intentional indentation
						// but flag single leading space as likely unintentional
						if (hasLeading && i === 0 && text.startsWith("  ")) {
							continue;
						}

						// Report leading space
						if (hasLeading) {
							context.report({
								message: "leadingSpace",
								range: getTSNodeRange(argument, context.sourceFile),
							});
						}

						// Report trailing space
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
