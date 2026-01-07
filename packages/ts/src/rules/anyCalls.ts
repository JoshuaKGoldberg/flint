import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";
import { getConstrainedTypeAtLocation } from "./utils/getConstrainedType.ts";
import { isBuiltinSymbolLike } from "./utils/isBuiltinSymbolLike.ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports calling a value with type `any`.",
		id: "anyCalls",
		preset: "logical",
	},
	messages: {
		unsafeCall: {
			primary: "Unsafe call of {{ type }} typed value.",
			secondary: [
				"Calling a value typed as `any` or `Function` bypasses TypeScript's type checking.",
				"TypeScript cannot verify that the value is actually a function, what parameters it expects, or what it returns.",
			],
			suggestions: [
				"Ensure the called value has a well-defined function type.",
			],
		},
		unsafeNew: {
			primary: "Unsafe construction of {{ type }} typed value.",
			secondary: [
				"Constructing a value typed as `any` or `Function` bypasses TypeScript's type checking.",
				"TypeScript cannot verify that the value is actually a constructor, what parameters it expects, or what it returns.",
			],
			suggestions: [
				"Ensure the constructed value has a well-defined constructor type.",
			],
		},
		unsafeTemplateTag: {
			primary: "Unsafe use of {{ type }} typed template tag.",
			secondary: [
				"Using a value typed as `any` or `Function` as a template tag bypasses TypeScript's type checking.",
				"TypeScript cannot verify that the value is a valid template tag function.",
			],
			suggestions: [
				"Ensure the template tag has a well-defined function type.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { program, sourceFile, typeChecker }) => {
					const type = getConstrainedTypeAtLocation(
						node.expression,
						typeChecker,
					);

					if (tsutils.isTypeFlagSet(type, ts.TypeFlags.Any)) {
						context.report({
							data: {
								type: tsutils.isIntrinsicErrorType(type) ? "`error`" : "`any`",
							},
							message: "unsafeCall",
							range: getTSNodeRange(node.expression, sourceFile),
						});
						return;
					}

					if (isBuiltinSymbolLike(program, type, "Function")) {
						if (
							type.getConstructSignatures().length > 0 ||
							type.getCallSignatures().length > 0
						) {
							return;
						}

						context.report({
							data: { type: "`Function`" },
							message: "unsafeCall",
							range: getTSNodeRange(node.expression, sourceFile),
						});
					}
				},
				NewExpression: (node, { program, sourceFile, typeChecker }) => {
					const type = getConstrainedTypeAtLocation(
						node.expression,
						typeChecker,
					);

					if (tsutils.isTypeFlagSet(type, ts.TypeFlags.Any)) {
						context.report({
							data: {
								type: tsutils.isIntrinsicErrorType(type) ? "`error`" : "`any`",
							},
							message: "unsafeNew",
							range: getTSNodeRange(node.expression, sourceFile),
						});
						return;
					}

					if (isBuiltinSymbolLike(program, type, "Function")) {
						const constructSignatures = type.getConstructSignatures();
						if (constructSignatures.length > 0) {
							return;
						}

						const callSignatures = type.getCallSignatures();
						if (
							callSignatures.some(
								(signature) =>
									!tsutils.isIntrinsicVoidType(signature.getReturnType()),
							)
						) {
							return;
						}

						context.report({
							data: { type: "`Function`" },
							message: "unsafeNew",
							range: getTSNodeRange(node.expression, sourceFile),
						});
					}
				},
				TaggedTemplateExpression: (
					node,
					{ program, sourceFile, typeChecker },
				) => {
					const type = getConstrainedTypeAtLocation(node.tag, typeChecker);

					if (tsutils.isTypeFlagSet(type, ts.TypeFlags.Any)) {
						context.report({
							data: {
								type: tsutils.isIntrinsicErrorType(type) ? "`error`" : "`any`",
							},
							message: "unsafeTemplateTag",
							range: getTSNodeRange(node.tag, sourceFile),
						});
						return;
					}

					if (isBuiltinSymbolLike(program, type, "Function")) {
						if (
							type.getConstructSignatures().length > 0 ||
							type.getCallSignatures().length > 0
						) {
							return;
						}

						context.report({
							data: { type: "`Function`" },
							message: "unsafeTemplateTag",
							range: getTSNodeRange(node.tag, sourceFile),
						});
					}
				},
			},
		};
	},
});
