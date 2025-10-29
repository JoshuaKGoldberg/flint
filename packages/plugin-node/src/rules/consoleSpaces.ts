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

function hasLeadingOrTrailingSpaces(text: string): boolean {
	return text.length > 0 && (text[0] === " " || text[text.length - 1] === " ");
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallow leading or trailing spaces in console method string arguments.",
		id: "consoleSpaces",
		preset: "stylistic",
	},
	messages: {
		noConsoleSpaces: {
			primary: "Avoid leading or trailing spaces in console method arguments.",
			secondary: [
				"Leading or trailing spaces in console output are often unintentional and can make debugging harder.",
				"Use explicit spacing in the format string or separate arguments instead.",
			],
			suggestions: ["Remove leading and trailing spaces from string literals"],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression(node: ts.CallExpression) {
					if (
						!ts.isPropertyAccessExpression(node.expression) ||
						!ts.isIdentifier(node.expression.expression) ||
						node.expression.expression.text !== "console" ||
						!ts.isIdentifier(node.expression.name) ||
						!CONSOLE_METHODS.has(node.expression.name.text)
					) {
						return;
					}

					for (const argument of node.arguments) {
						if (
							ts.isStringLiteral(argument) &&
							hasLeadingOrTrailingSpaces(argument.text)
						) {
							context.report({
								message: "noConsoleSpaces",
								range: getTSNodeRange(argument, context.sourceFile),
							});
						}
					}
				},
			},
		};
	},
});
