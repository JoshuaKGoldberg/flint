import { SyntaxKind } from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";
import * as AST from "../types/ast.ts";
import { hasSameTokens } from "../utils/hasSameTokens.ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Prefer the spread operator over `.apply()` calls.",
		id: "functionCallSpreads",
		preset: "stylistic",
	},
	messages: {
		preferSpread: {
			primary: "Use the spread operator instead of `.apply()`.",
			secondary: [
				"The spread operator (`...`) provides cleaner syntax for variadic function calls.",
				"`func.apply(thisArg, args)` can be replaced with `func.call(thisArg, ...args)` or `thisArg.func(...args)`.",
			],
			suggestions: [
				"Replace `.apply(thisArg, args)` with spread syntax like `func(...args)`.",
			],
		},
	},
	setup(context) {
		function isNullOrUndefined(node: AST.Expression) {
			return (
				node.kind === SyntaxKind.NullKeyword ||
				(node.kind === SyntaxKind.Identifier && node.text === "undefined")
			);
		}

		function isApplyCall(node: AST.CallExpression) {
			if (node.expression.kind !== SyntaxKind.PropertyAccessExpression) {
				return false;
			}

			const propertyAccess = node.expression;
			if (propertyAccess.name.kind !== SyntaxKind.Identifier) {
				return false;
			}

			return propertyAccess.name.text === "apply";
		}

		function isVariadicApplyCall(node: AST.CallExpression) {
			if (!isApplyCall(node)) {
				return false;
			}

			if (node.arguments.length !== 2) {
				return false;
			}

			const secondArg = node.arguments[1];

			if (secondArg.kind === SyntaxKind.ArrayLiteralExpression) {
				return false;
			}

			if (secondArg.kind === SyntaxKind.SpreadElement) {
				return false;
			}

			return true;
		}

		function getExpectedThis(
			node: AST.PropertyAccessExpression,
		): AST.Expression | undefined {
			const applied = node.expression;

			if (applied.kind === SyntaxKind.PropertyAccessExpression) {
				return applied.expression;
			}

			return undefined;
		}

		function isValidThisArg(
			expectedThis: AST.Expression | undefined,
			thisArg: AST.Expression,
			sourceFile: AST.SourceFile,
		) {
			if (!expectedThis) {
				return isNullOrUndefined(thisArg);
			}

			return hasSameTokens(expectedThis, thisArg, sourceFile);
		}

		return {
			visitors: {
				CallExpression: (node, { sourceFile }) => {
					if (!isVariadicApplyCall(node)) {
						return;
					}

					const propertyAccess =
						node.expression as AST.PropertyAccessExpression;
					const expectedThis = getExpectedThis(propertyAccess);
					const thisArg = node.arguments[0];

					if (!isValidThisArg(expectedThis, thisArg, sourceFile)) {
						return;
					}

					context.report({
						message: "preferSpread",
						range: getTSNodeRange(node, sourceFile),
					});
				},
			},
		};
	},
});
