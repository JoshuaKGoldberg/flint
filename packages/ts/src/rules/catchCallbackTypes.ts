import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports Promise catch callback parameters that are not typed as unknown.",
		id: "catchCallbackTypes",
		preset: "logical",
	},
	messages: {
		preferUnknown: {
			primary:
				"The catch callback parameter should be typed as `unknown` instead of `any`.",
			secondary: [
				"TypeScript's `useUnknownInCatchVariables` option only affects synchronous catch clauses, not Promise callbacks.",
				"Promise rejection values can be anything, so using `unknown` forces proper type narrowing before use.",
				"Using `any` in catch callbacks undermines type safety and can lead to runtime errors.",
			],
			suggestions: [
				"Add an explicit `: unknown` type annotation to the callback parameter.",
			],
		},
	},
	setup(context) {
		function isCatchOrThenCallback(
			node: ts.CallExpression,
			typeChecker: ts.TypeChecker,
		): "catch" | "then" | undefined {
			if (!ts.isPropertyAccessExpression(node.expression)) {
				return undefined;
			}

			const methodName = node.expression.name.text;
			if (methodName !== "catch" && methodName !== "then") {
				return undefined;
			}

			const objectType = typeChecker.getTypeAtLocation(
				node.expression.expression,
			);
			const symbol = objectType.getSymbol();

			if (!symbol) {
				const typeString = typeChecker.typeToString(objectType);
				if (typeString.startsWith("Promise<")) {
					return methodName === "catch" ? "catch" : "then";
				}
				return undefined;
			}

			const symbolName = symbol.getName();
			if (symbolName === "Promise") {
				return methodName === "catch" ? "catch" : "then";
			}

			for (const declaration of symbol.getDeclarations() ?? []) {
				if (
					ts.isInterfaceDeclaration(declaration) &&
					declaration.name.text === "Promise"
				) {
					return methodName === "catch" ? "catch" : "then";
				}
			}

			return undefined;
		}

		function checkCallbackParameter(
			callback: ts.Expression,
			sourceFile: ts.SourceFile,
			typeChecker: ts.TypeChecker,
		) {
			if (!ts.isFunctionLike(callback)) {
				return;
			}

			const firstParam = callback.parameters[0];
			if (!firstParam) {
				return;
			}

			if (firstParam.type) {
				const paramType = typeChecker.getTypeFromTypeNode(firstParam.type);

				if (tsutils.isTypeFlagSet(paramType, ts.TypeFlags.Unknown)) {
					return;
				}

				if (!tsutils.isTypeFlagSet(paramType, ts.TypeFlags.Any)) {
					return;
				}
			}

			context.report({
				message: "preferUnknown",
				range: {
					begin: firstParam.name.getStart(sourceFile),
					end: firstParam.type
						? firstParam.type.getEnd()
						: firstParam.name.getEnd(),
				},
			});
		}

		return {
			visitors: {
				CallExpression: (node, { sourceFile, typeChecker }) => {
					const callbackType = isCatchOrThenCallback(node, typeChecker);

					if (!callbackType) {
						return;
					}

					if (callbackType === "catch" && node.arguments.length >= 1) {
						checkCallbackParameter(node.arguments[0], sourceFile, typeChecker);
					} else if (callbackType === "then" && node.arguments.length >= 2) {
						checkCallbackParameter(node.arguments[1], sourceFile, typeChecker);
					}
				},
			},
		};
	},
});
