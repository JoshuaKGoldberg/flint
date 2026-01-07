import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";
import { AnyType, discriminateAnyType } from "./utils/discriminateAnyType.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports calling a function with a value typed as `any` as an argument.",
		id: "anyArguments",
		preset: "logical",
	},
	messages: {
		unsafeArgument: {
			primary:
				"Unsafe argument of type `{{ type }}` assigned to parameter of type `{{ paramType }}`.",
			secondary: [
				"Passing a value of type `any` or a similar unsafe type as an argument defeats TypeScript's type safety guarantees.",
				"This can allow unexpected types to propagate through your codebase, potentially causing runtime errors.",
			],
			suggestions: [
				"Ensure the argument has a well-defined, specific type before passing it to the function.",
			],
		},
		unsafeSpread: {
			primary: "Unsafe spread of type `{{ type }}` in function call.",
			secondary: [
				"Spreading an `any` or `any[]` typed value as function arguments bypasses type checking.",
				"This can allow unexpected types to propagate through your codebase, potentially causing runtime errors.",
			],
			suggestions: [
				"Ensure the spread value has a well-defined tuple or array type before spreading it.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { program, sourceFile, typeChecker }) => {
					checkCallArguments(node, program, sourceFile, typeChecker, context);
				},
				NewExpression: (node, { program, sourceFile, typeChecker }) => {
					checkCallArguments(node, program, sourceFile, typeChecker, context);
				},
			},
		};

		function checkCallArguments(
			node: ts.CallExpression | ts.NewExpression,
			program: ts.Program,
			sourceFile: ts.SourceFile,
			typeChecker: ts.TypeChecker,
			ctx: typeof context,
		) {
			if (!node.arguments) {
				return;
			}

			const signature = typeChecker.getResolvedSignature(node);
			if (!signature) {
				return;
			}

			const parameters = signature.getParameters();

			for (let i = 0; i < node.arguments.length; i++) {
				const argument = node.arguments[i];
				const argumentType = typeChecker.getTypeAtLocation(argument);

				if (ts.isSpreadElement(argument)) {
					const spreadType = typeChecker.getTypeAtLocation(argument.expression);
					const anyType = discriminateAnyType(
						spreadType,
						typeChecker,
						program,
						argument.expression,
					);

					if (anyType === AnyType.Safe) {
						continue;
					}

					const restParameter = parameters.at(-1);
					if (restParameter) {
						const restType = typeChecker.getTypeOfSymbol(restParameter);
						if (
							tsutils.isTypeFlagSet(
								restType,
								ts.TypeFlags.Any | ts.TypeFlags.Unknown,
							)
						) {
							continue;
						}
						if (typeChecker.isArrayType(restType)) {
							const elementType = typeChecker.getTypeArguments(
								restType as ts.TypeReference,
							)[0];
							if (
								tsutils.isTypeFlagSet(
									elementType,
									ts.TypeFlags.Any | ts.TypeFlags.Unknown,
								)
							) {
								continue;
							}
						}
					}

					ctx.report({
						data: {
							type:
								anyType === AnyType.Any
									? "any"
									: anyType === AnyType.AnyArray
										? "any[]"
										: "Promise<any>",
						},
						message: "unsafeSpread",
						range: {
							begin: argument.getStart(sourceFile),
							end: argument.getEnd(),
						},
					});
					continue;
				}

				const anyType = discriminateAnyType(
					argumentType,
					typeChecker,
					program,
					argument,
				);

				if (anyType === AnyType.Safe) {
					continue;
				}

				const parameter = parameters[i] ?? parameters[parameters.length - 1];
				if (parameters.length === 0) {
					continue;
				}

				const parameterType = typeChecker.getTypeOfSymbol(parameter);

				if (
					tsutils.isTypeFlagSet(
						parameterType,
						ts.TypeFlags.Any | ts.TypeFlags.Unknown,
					)
				) {
					continue;
				}

				ctx.report({
					data: {
						paramType: typeChecker.typeToString(parameterType),
						type:
							anyType === AnyType.Any
								? "any"
								: anyType === AnyType.AnyArray
									? "any[]"
									: "Promise<any>",
					},
					message: "unsafeArgument",
					range: {
						begin: argument.getStart(sourceFile),
						end: argument.getEnd(),
					},
				});
			}
		}
	},
});
