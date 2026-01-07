import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";
import { AnyType, discriminateAnyType } from "./utils/discriminateAnyType.ts";
import { isUnsafeAssignment } from "./utils/isUnsafeAssignment.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports assigning a value with type `any` to variables and properties.",
		id: "anyAssignments",
		preset: "logical",
	},
	messages: {
		unsafeArrayDestructure: {
			primary: "Unsafe array destructuring of a value of type {{ type }}.",
			secondary: [
				"Destructuring an `any[]` array defeats TypeScript's type safety guarantees.",
				"This can allow unexpected types to propagate through your codebase, potentially causing runtime errors.",
			],
			suggestions: [
				"Ensure the array has a well-defined, specific element type.",
			],
		},
		unsafeArraySpread: {
			primary:
				"Unsafe spread of type `{{ sender }}` into array of type `{{ receiver }}`.",
			secondary: [
				"Spreading an `any[]` into a typed array defeats TypeScript's type safety guarantees.",
				"This can allow unexpected types to propagate through your codebase, potentially causing runtime errors.",
			],
			suggestions: ["Ensure the spread array has compatible element types."],
		},
		unsafeAssignment: {
			primary: "Unsafe assignment of a value of type {{ type }}.",
			secondary: [
				"Assigning a value of type `any` or a similar unsafe type defeats TypeScript's type safety guarantees.",
				"This can allow unexpected types to propagate through your codebase, potentially causing runtime errors.",
			],
			suggestions: [
				"Ensure the assigned value has a well-defined, specific type.",
			],
		},
		unsafeAssignmentToVariable: {
			primary:
				"Unsafe assignment of type `{{ sender }}` to variable of type `{{ receiver }}`.",
			secondary: [
				"The variable's declared type does not safely accept the value being assigned.",
				"This can allow unexpected types to propagate through your codebase, potentially causing runtime errors.",
			],
			suggestions: [
				"Adjust the type of the variable to match the assigned value, if appropriate.",
				"Otherwise, refine the assigned value to ensure it matches the expected type.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				ArrayLiteralExpression: (node, { sourceFile, typeChecker }) => {
					for (const element of node.elements) {
						if (!ts.isSpreadElement(element)) {
							continue;
						}

						const spreadType = typeChecker.getTypeAtLocation(
							element.expression,
						);
						if (!typeChecker.isArrayType(spreadType)) {
							continue;
						}

						const spreadElementType = typeChecker.getTypeArguments(
							spreadType as ts.TypeReference,
						)[0];
						if (!tsutils.isTypeFlagSet(spreadElementType, ts.TypeFlags.Any)) {
							continue;
						}

						const parentType = typeChecker.getContextualType(node);
						if (!parentType || !typeChecker.isArrayType(parentType)) {
							continue;
						}

						const parentElementType = typeChecker.getTypeArguments(
							parentType as ts.TypeReference,
						)[0];
						if (
							tsutils.isTypeFlagSet(
								parentElementType,
								ts.TypeFlags.Any | ts.TypeFlags.Unknown,
							)
						) {
							continue;
						}

						context.report({
							data: {
								receiver: typeChecker.typeToString(parentType),
								sender: typeChecker.typeToString(spreadType),
							},
							message: "unsafeArraySpread",
							range: {
								begin: element.getStart(sourceFile),
								end: element.getEnd(),
							},
						});
					}
				},
				VariableDeclaration: (node, { program, sourceFile, typeChecker }) => {
					if (!node.initializer) {
						return;
					}

					const initializerType = typeChecker.getTypeAtLocation(
						node.initializer,
					);
					const anyType = discriminateAnyType(
						initializerType,
						typeChecker,
						program,
						node.initializer,
					);

					if (ts.isArrayBindingPattern(node.name)) {
						if (anyType === AnyType.AnyArray) {
							context.report({
								data: { type: "`any[]`" },
								message: "unsafeArrayDestructure",
								range: {
									begin: node.name.getStart(sourceFile),
									end: node.name.getEnd(),
								},
							});
						}
						return;
					}

					if (!node.type) {
						if (anyType !== AnyType.Safe) {
							context.report({
								data: {
									type:
										anyType === AnyType.Any
											? "`any`"
											: anyType === AnyType.PromiseAny
												? "`Promise<any>`"
												: "`any[]`",
								},
								message: "unsafeAssignment",
								range: {
									begin: node.getStart(sourceFile),
									end: node.getEnd(),
								},
							});
						}
						return;
					}

					const declaredType = typeChecker.getTypeAtLocation(node.name);
					if (
						tsutils.isTypeFlagSet(
							declaredType,
							ts.TypeFlags.Any | ts.TypeFlags.Unknown,
						)
					) {
						return;
					}

					const result = isUnsafeAssignment(
						initializerType,
						declaredType,
						typeChecker,
						node.initializer,
					);
					if (!result) {
						return;
					}

					context.report({
						data: {
							receiver: typeChecker.typeToString(result.receiver),
							sender: typeChecker.typeToString(result.sender),
						},
						message: "unsafeAssignmentToVariable",
						range: {
							begin: node.getStart(sourceFile),
							end: node.getEnd(),
						},
					});
				},
			},
		};
	},
});
