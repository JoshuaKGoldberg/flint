import { SyntaxKind } from "typescript";

import { typescriptLanguage } from "../language.ts";
import * as AST from "../types/ast.ts";
import type { Checker } from "../types/checker.ts";
import { isGlobalDeclarationOfName } from "../utils/isGlobalDeclarationOfName.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer Date.now() to get the number of milliseconds since the Unix Epoch.",
		id: "dateNowTimestamps",
		preset: "logical",
	},
	messages: {
		preferDateNow: {
			primary: "Use Date.now() to get the current timestamp.",
			secondary: [
				"Date.now() is shorter and avoids unnecessary instantiation of Date objects.",
				"It's more efficient and clearer than alternatives like new Date().getTime().",
			],
			suggestions: ["Replace with Date.now()."],
		},
	},
	setup(context) {
		function isNewDateWithNoArguments(
			node: AST.Expression,
			typeChecker: Checker,
		) {
			return (
				node.kind === SyntaxKind.NewExpression &&
				node.expression.kind === SyntaxKind.Identifier &&
				node.expression.text === "Date" &&
				(!node.arguments || node.arguments.length === 0) &&
				isGlobalDeclarationOfName(node.expression, "Date", typeChecker)
			);
		}

		return {
			visitors: {
				CallExpression: (node, { sourceFile, typeChecker }) => {
					if (node.expression.kind !== SyntaxKind.PropertyAccessExpression) {
						return;
					}

					const propertyAccess = node.expression;
					if (propertyAccess.name.kind !== SyntaxKind.Identifier) {
						return;
					}

					const methodName = propertyAccess.name.text;
					if (methodName !== "getTime" && methodName !== "valueOf") {
						return;
					}

					if (node.arguments.length !== 0) {
						return;
					}

					if (
						!isNewDateWithNoArguments(propertyAccess.expression, typeChecker)
					) {
						return;
					}

					context.report({
						message: "preferDateNow",
						range: {
							begin: propertyAccess.expression.getStart(sourceFile),
							end: node.getEnd(),
						},
					});
				},
				NewExpression: (node, { sourceFile, typeChecker }) => {
					if (!isNewDateWithNoArguments(node, typeChecker)) {
						return;
					}

					const { parent } = node;

					if (
						parent.kind === SyntaxKind.PrefixUnaryExpression &&
						(parent.operator === SyntaxKind.PlusToken ||
							parent.operator === SyntaxKind.MinusToken)
					) {
						context.report({
							message: "preferDateNow",
							range: {
								begin: node.getStart(sourceFile),
								end: node.getEnd(),
							},
						});
						return;
					}

					if (
						parent.kind === SyntaxKind.CallExpression &&
						parent.expression.kind === SyntaxKind.Identifier &&
						(parent.expression.text === "Number" ||
							parent.expression.text === "BigInt") &&
						parent.arguments.length === 1 &&
						isGlobalDeclarationOfName(
							parent.expression,
							parent.expression.text,
							typeChecker,
						)
					) {
						context.report({
							message: "preferDateNow",
							range: {
								begin: parent.getStart(sourceFile),
								end: parent.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
