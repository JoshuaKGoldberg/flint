import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";
import { isGlobalDeclarationOfName } from "../utils/isGlobalDeclarationOfName.ts";

const coercionFunctions = new Set([
	"BigInt",
	"Boolean",
	"Number",
	"String",
	"Symbol",
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports functions that can be replaced with built-in coercion functions like String, Number, Boolean, BigInt, or Symbol.",
		id: "builtinCoercions",
		preset: "stylistic",
		strictness: "strict",
	},
	messages: {
		preferBuiltin: {
			primary:
				"Use {{ builtin }} directly instead of wrapping it in a function.",
			secondary: [
				"Wrapping built-in coercion functions like `String`, `Number`, `Boolean`, `BigInt`, or `Symbol` in another function adds unnecessary overhead.",
				"The built-in functions are concise and universally understood.",
			],
			suggestions: ["Replace the wrapper function with {{ builtin }}."],
		},
	},
	setup(context) {
		function getReturnedExpression(
			body: ts.ConciseBody,
		): ts.Expression | undefined {
			if (ts.isBlock(body)) {
				if (body.statements.length !== 1) {
					return undefined;
				}

				const statement = body.statements[0];
				if (!ts.isReturnStatement(statement) || !statement.expression) {
					return undefined;
				}

				return statement.expression;
			}

			return body;
		}

		function isCoercionCall(
			expression: ts.Expression,
			parameterName: string,
			typeChecker: ts.TypeChecker,
		): string | undefined {
			if (!ts.isCallExpression(expression)) {
				return undefined;
			}

			if (!ts.isIdentifier(expression.expression)) {
				return undefined;
			}

			const calledName = expression.expression.text;
			if (!coercionFunctions.has(calledName)) {
				return undefined;
			}

			if (
				!isGlobalDeclarationOfName(
					expression.expression,
					calledName,
					typeChecker,
				)
			) {
				return undefined;
			}

			if (expression.arguments.length !== 1) {
				return undefined;
			}

			const argument = expression.arguments[0];
			if (!ts.isIdentifier(argument) || argument.text !== parameterName) {
				return undefined;
			}

			return calledName;
		}

		function isIdentityReturn(
			expression: ts.Expression,
			parameterName: string,
		): boolean {
			return ts.isIdentifier(expression) && expression.text === parameterName;
		}

		function checkFunction(
			node: ts.ArrowFunction | ts.FunctionExpression,
			sourceFile: ts.SourceFile,
			typeChecker: ts.TypeChecker,
		) {
			if (node.parameters.length !== 1) {
				return;
			}

			const parameter = node.parameters[0];
			if (!ts.isIdentifier(parameter.name)) {
				return;
			}

			const parameterName = parameter.name.text;
			const returnExpression = getReturnedExpression(node.body);

			if (!returnExpression) {
				return;
			}

			const coercionName = isCoercionCall(
				returnExpression,
				parameterName,
				typeChecker,
			);

			if (coercionName) {
				context.report({
					data: { builtin: coercionName },
					message: "preferBuiltin",
					range: {
						begin: node.getStart(sourceFile),
						end: node.getEnd(),
					},
				});
				return;
			}

			if (isIdentityReturn(returnExpression, parameterName)) {
				context.report({
					data: { builtin: "Boolean" },
					message: "preferBuiltin",
					range: {
						begin: node.getStart(sourceFile),
						end: node.getEnd(),
					},
				});
			}
		}

		return {
			visitors: {
				ArrowFunction: (node, { sourceFile, typeChecker }) => {
					checkFunction(node, sourceFile, typeChecker);
				},
				FunctionExpression: (node, { sourceFile, typeChecker }) => {
					checkFunction(node, sourceFile, typeChecker);
				},
			},
		};
	},
});
