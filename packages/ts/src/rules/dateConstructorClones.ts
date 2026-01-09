import { SyntaxKind } from "typescript";

import { typescriptLanguage } from "../language.ts";
import * as AST from "../types/ast.ts";
import type { Checker } from "../types/checker.ts";
import { isGlobalDeclarationOfName } from "../utils/isGlobalDeclarationOfName.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer passing Date directly to the constructor when cloning.",
		id: "dateConstructorClones",
		preset: "logical",
	},
	messages: {
		unnecessaryGetTime: {
			primary: "Prefer passing the Date directly instead of calling getTime().",
			secondary: [
				"The Date constructor can clone a Date object directly when passed as an argument.",
				"Calling getTime() first is unnecessary since ES2015.",
			],
			suggestions: ["Remove the `.getTime()` call and pass the Date directly."],
		},
	},
	setup(context) {
		function isDateType(node: AST.Expression, typeChecker: Checker) {
			const objectType = typeChecker.getTypeAtLocation(node);
			const symbol = objectType.getSymbol();
			return symbol !== undefined && symbol.getName() === "Date";
		}

		return {
			visitors: {
				NewExpression: (node, { sourceFile, typeChecker }) => {
					if (node.expression.kind !== SyntaxKind.Identifier) {
						return;
					}

					if (node.expression.text !== "Date") {
						return;
					}

					if (node.arguments?.length !== 1) {
						return;
					}

					if (
						!isGlobalDeclarationOfName(node.expression, "Date", typeChecker)
					) {
						return;
					}

					const argument = node.arguments[0];
					if (!argument || argument.kind !== SyntaxKind.CallExpression) {
						return;
					}

					if (
						argument.expression.kind !== SyntaxKind.PropertyAccessExpression
					) {
						return;
					}

					if (
						argument.expression.name.kind !== SyntaxKind.Identifier ||
						argument.expression.name.text !== "getTime"
					) {
						return;
					}

					if (argument.arguments.length !== 0) {
						return;
					}

					if (!isDateType(argument.expression.expression, typeChecker)) {
						return;
					}

					context.report({
						message: "unnecessaryGetTime",
						range: {
							begin: argument.expression.name.getStart(sourceFile),
							end: argument.getEnd(),
						},
					});
				},
			},
		};
	},
});
