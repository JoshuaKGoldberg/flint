import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
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
			if (!ts.isPropertyAccessExpression(node)) {
				return false;
			}

			return ts.isIdentifier(node.name) && node.name.text === "firstChild";
		}

		return {
			visitors: {
				CallExpression(node: ts.CallExpression) {
					if (!ts.isPropertyAccessExpression(node.expression)) {
						return;
					}

					const { name } = node.expression;
					if (!ts.isIdentifier(name)) {
						return;
					}

					const methodName = name.text;

					if (methodName === "appendChild") {
						context.report({
							data: { method: "appendChild" },
							message: "preferAppend",
							range: getTSNodeRange(name, context.sourceFile),
						});
						return;
					}

					if (methodName === "insertBefore" && node.arguments.length >= 2) {
						const secondArg = node.arguments[1];
						// insertBefore(node, null) is equivalent to appendChild
						if (
							secondArg.kind === ts.SyntaxKind.NullKeyword ||
							isFirstChildAccess(secondArg)
						) {
							context.report({
								data:
									secondArg.kind === ts.SyntaxKind.NullKeyword
										? { method: "insertBefore" }
										: {},
								message:
									secondArg.kind === ts.SyntaxKind.NullKeyword
										? "preferAppend"
										: "preferPrepend",
								range: getTSNodeRange(name, context.sourceFile),
							});
						}
					}
				},
			},
		};
	},
});
