import type { RuleContext } from "@flint.fyi/core";

import { runtimeBase } from "@flint.fyi/core";
import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { typescriptLanguage, type TypeScriptServices } from "../language.js";
import { AnyType, discriminateAnyType } from "./utils/discriminateAnyType.js";
import { getConstrainedTypeAtLocation } from "./utils/getConstrainedType.js";
import { getThisExpression } from "./utils/getThisExpression.js";
import { isUnsafeAssignment } from "./utils/isUnsafeAssignment.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports returning a value with type `any` from a function.",
		id: "anyReturns",
		preset: "logical",
	},
	messages: {
		unsafeReturn: {
			primary: "Unsafe return of a value of type {{ type }}.",
			secondary: [
				"Returning a value of type `any` or a similar unsafe type defeats TypeScript's type safety guarantees.",
				"This can allow unexpected types to propagate through your codebase, potentially causing runtime errors.",
			],
			suggestions: [
				"Ensure the returned value has a well-defined, specific type.",
			],
		},
		unsafeReturnAssignment: {
			primary:
				"Unsafe return of type `{{ sender }}` from function with return type `{{ receiver }}`.",
			secondary: [
				"The function's declared return type does not safely accept the value being returned.",
				"This can allow unexpected types to propagate through your codebase, potentially causing runtime errors.",
			],
			suggestions: [
				"Adjust the return type of the function to match the returned value, if appropriate.",
				"Otherwise, refine the returned value to ensure it matches the expected return type.",
			],
		},
		unsafeReturnThis: {
			primary:
				"Unsafe return of a value of type `{{ type }}`. `this` is typed as `any`.",
			secondary: [
				"Returning `this` when it is implicitly typed as `any` introduces type-unsafe behavior.",
				"This can allow unexpected types to propagate through your codebase, potentially causing runtime errors.",
			],
			suggestions: [
				"Enable the `noImplicitThis` compiler option to enforce explicit `this` types.",
				"Add an explicit `this` parameter to the function to clarify its type.",
			],
		},
	},
	setup() {
		return {
			...runtimeBase,
			visitors: {
				ArrowFunction: (node, context) => {
					if (!ts.isBlock(node.body)) {
						checkReturn(context, node.body, node.body);
					}
				},
				ReturnStatement: (node, context) => {
					if (node.expression != null) {
						checkReturn(context, node.expression, node);
					}
				},
			},
		};
	},
});

function checkReturn(
	context: RuleContext<
		"unsafeReturn" | "unsafeReturnAssignment" | "unsafeReturnThis"
	> &
		TypeScriptServices,
	returnNode: ts.Node,
	reportingNode: ts.Node,
) {
	const isNoImplicitThis = tsutils.isStrictCompilerOptionEnabled(
		context.program.getCompilerOptions(),
		"noImplicitThis",
	);

	const type = context.typeChecker.getTypeAtLocation(returnNode);

	const anyType = discriminateAnyType(
		type,
		context.typeChecker,
		context.program,
		returnNode,
	);
	const functionNode = ts.findAncestor(
		returnNode,
		// TODO: I believe isFunctionLikeDeclaration was incorrectly marked
		// as deprecated in https://github.com/JoshuaKGoldberg/ts-api-utils/pull/124
		// It says "With TypeScript v5, in favor of typescript's `isFunctionLike`."
		// However, isFunctionLike also checks for signature-like nodes,
		// whereas isFunctionLikeDeclaration checks only for function-like nodes.
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		tsutils.isFunctionLikeDeclaration,
	);
	if (!functionNode) {
		return;
	}

	// function has an explicit return type, so ensure it's a safe return
	const returnNodeType = getConstrainedTypeAtLocation(
		returnNode,
		context.typeChecker,
	);

	// function expressions will not have their return type modified based on receiver typing
	// so we have to use the contextual typing in these cases, i.e.
	// const foo1: () => Set<string> = () => new Set<any>();
	// the return type of the arrow function is Set<any> even though the variable is typed as Set<string>
	let functionType =
		ts.isFunctionExpression(functionNode) || ts.isArrowFunction(functionNode)
			? context.typeChecker.getContextualType(functionNode)
			: context.typeChecker.getTypeAtLocation(functionNode);
	functionType ??= context.typeChecker.getTypeAtLocation(functionNode);
	const callSignatures = tsutils.getCallSignaturesOfType(functionType);
	// If there is an explicit type annotation *and* that type matches the actual
	// function return type, we shouldn't complain (it's intentional, even if unsafe)
	if (functionNode.type) {
		for (const signature of callSignatures) {
			const signatureReturnType = signature.getReturnType();

			if (
				returnNodeType === signatureReturnType ||
				tsutils.isTypeFlagSet(
					signatureReturnType,
					ts.TypeFlags.Any | ts.TypeFlags.Unknown,
				)
			) {
				return;
			}
			if (
				tsutils.includesModifier(
					functionNode.modifiers,
					ts.SyntaxKind.AsyncKeyword,
				)
			) {
				const awaitedSignatureReturnType =
					context.typeChecker.getAwaitedType(signatureReturnType);

				const awaitedReturnNodeType =
					context.typeChecker.getAwaitedType(returnNodeType);
				if (
					awaitedReturnNodeType === awaitedSignatureReturnType ||
					(awaitedSignatureReturnType &&
						tsutils.isTypeFlagSet(
							awaitedSignatureReturnType,
							ts.TypeFlags.Any | ts.TypeFlags.Unknown,
						))
				) {
					return;
				}
			}
		}
	}

	if (anyType !== AnyType.Safe) {
		// Allow cases when the declared return type of the function is either unknown or unknown[]
		// and the function is returning any or any[].
		for (const signature of callSignatures) {
			const functionReturnType = signature.getReturnType();
			if (
				anyType === AnyType.Any &&
				tsutils.isTypeFlagSet(functionReturnType, ts.TypeFlags.Unknown)
			) {
				return;
			}
			if (
				anyType === AnyType.AnyArray &&
				context.typeChecker.isArrayType(functionReturnType) &&
				tsutils.isTypeFlagSet(
					context.typeChecker.getTypeArguments(
						functionReturnType as ts.TypeReference,
					)[0],
					ts.TypeFlags.Unknown,
				)
			) {
				return;
			}
			const awaitedType =
				context.typeChecker.getAwaitedType(functionReturnType);
			if (
				awaitedType &&
				anyType === AnyType.PromiseAny &&
				tsutils.isTypeFlagSet(awaitedType, ts.TypeFlags.Unknown)
			) {
				return;
			}
		}

		if (
			anyType === AnyType.PromiseAny &&
			!tsutils.includesModifier(
				functionNode.modifiers,
				ts.SyntaxKind.AsyncKeyword,
			)
		) {
			return;
		}

		let message: "unsafeReturn" | "unsafeReturnThis" = "unsafeReturn";
		const isErrorType = tsutils.isIntrinsicErrorType(returnNodeType);

		if (!isNoImplicitThis) {
			// `return this`
			const thisExpression = getThisExpression(returnNode);
			if (
				thisExpression &&
				tsutils.isTypeFlagSet(
					getConstrainedTypeAtLocation(thisExpression, context.typeChecker),
					ts.TypeFlags.Any,
				)
			) {
				message = "unsafeReturnThis";
			}
		}

		// If the function return type was not unknown/unknown[], mark usage as unsafeReturn.
		context.report({
			data: {
				type: isErrorType
					? "error"
					: anyType === AnyType.Any
						? "`any`"
						: anyType === AnyType.PromiseAny
							? "`Promise<any>`"
							: "`any[]`",
			},
			message,
			range: {
				begin: reportingNode.getStart(),
				end: reportingNode.getEnd(),
			},
		});
		return;
	}

	const signature = functionType.getCallSignatures().at(0);
	if (signature) {
		const functionReturnType = signature.getReturnType();
		const result = isUnsafeAssignment(
			returnNodeType,
			functionReturnType,
			context.typeChecker,
			returnNode,
		);
		if (!result) {
			return;
		}

		const { receiver, sender } = result;
		context.report({
			data: {
				receiver: context.typeChecker.typeToString(receiver),
				sender: context.typeChecker.typeToString(sender),
			},
			message: "unsafeReturnAssignment",
			range: {
				begin: reportingNode.getStart(),
				end: reportingNode.getEnd(),
			},
		});
		return;
	}
}
