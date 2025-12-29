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

function isConsoleMethodCall(node: ts.Expression, typeChecker: ts.TypeChecker) {
	return (
		ts.isPropertyAccessExpression(node) &&
		ts.isIdentifier(node.expression) &&
		node.expression.text === "console" &&
		ts.isIdentifier(node.name) &&
		consoleMethods.has(node.name.text) &&
		isNodeConsole(node.expression, typeChecker)
	);
}

function isNodeConsole(node: ts.Expression, typeChecker: ts.TypeChecker) {
	const declarations = typeChecker
		.getTypeAtLocation(node)
		.getSymbol()
		?.getDeclarations();

	return (
		declarations?.length &&
		declarations.some((declaration) => {
			return declaration
				.getSourceFile()
				.fileName.includes("node_modules/@types/node/console.d.ts");
		})
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
				CallExpression(node: ts.CallExpression, { typeChecker }) {
					if (!isConsoleMethodCall(node.expression, typeChecker)) {
						return;
					}

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
