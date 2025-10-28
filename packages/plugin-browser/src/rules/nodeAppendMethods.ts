import {
	getTSNodeRange,
	isGlobalDeclaration,
	typescriptLanguage,
} from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer modern DOM append/prepend methods over appendChild/insertBefore.",
		id: "nodeAppendMethods",
		preset: "logical",
		strictness: "strict",
	},
	messages: {
		preferAppend: {
			primary: "Prefer `append()` over `{{ method }}()`.",
			secondary: [
				"The modern `append()` method is more flexible and readable.",
				"It accepts multiple nodes and strings, while the legacy method only accepts a single Node.",
			],
			suggestions: ["Use `append()` instead of `{{ method }}()`."],
		},
		preferPrepend: {
			primary: "Prefer `prepend()` over `insertBefore()`.",
			secondary: [
				"The modern `prepend()` method is more flexible and readable.",
				"It accepts multiple nodes and strings, while `insertBefore()` only accepts a single Node.",
			],
			suggestions: [
				"Use `prepend()` instead of `insertBefore()` when inserting at the beginning.",
			],
		},
	},
	setup(context) {
		function isFirstChildAccess(node: ts.Expression): boolean {
			return (
				ts.isPropertyAccessExpression(node) &&
				ts.isIdentifier(node.name) &&
				node.name.text === "firstChild"
			);
		}

		return {
			visitors: {
				CallExpression(node: ts.CallExpression) {
					if (
						!ts.isPropertyAccessExpression(node.expression) ||
						!ts.isIdentifier(node.expression.name) ||
						!isGlobalDeclaration(node.expression.name, context.typeChecker)
					) {
						return;
					}

					switch (node.expression.name.text) {
						case "appendChild":
							context.report({
								data: { method: "appendChild" },
								message: "preferAppend",
								range: getTSNodeRange(node.expression.name, context.sourceFile),
							});
							break;

						case "insertBefore": {
							if (node.arguments.length < 2) {
								break;
							}

							const secondArgument = node.arguments[1];
							if (
								secondArgument.kind !== ts.SyntaxKind.NullKeyword &&
								!isFirstChildAccess(secondArgument)
							) {
								break;
							}

							context.report({
								data:
									secondArgument.kind === ts.SyntaxKind.NullKeyword
										? { method: "insertBefore" }
										: {},
								message:
									secondArgument.kind === ts.SyntaxKind.NullKeyword
										? "preferAppend"
										: "preferPrepend",
								range: getTSNodeRange(node.expression.name, context.sourceFile),
							});
						}
					}
				},
			},
		};
	},
});
