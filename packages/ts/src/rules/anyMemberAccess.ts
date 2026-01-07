import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";
import { getConstrainedTypeAtLocation } from "./utils/getConstrainedType.ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports member access on a value with type `any`.",
		id: "anyMemberAccess",
		preset: "logical",
	},
	messages: {
		unsafeComputedMemberAccess: {
			primary: "Computed key is {{ type }} typed.",
			secondary: [
				"Using a value typed as `any` as a computed property key bypasses TypeScript's type checking.",
				"TypeScript cannot verify that the key is valid for the object being accessed.",
			],
			suggestions: ["Ensure the computed key has a well-defined type."],
		},
		unsafeMemberAccess: {
			primary: "Unsafe member access on {{ type }} typed value.",
			secondary: [
				"Accessing a member of a value typed as `any` bypasses TypeScript's type checking.",
				"TypeScript cannot verify that the member exists or what type it has.",
			],
			suggestions: [
				"Ensure the accessed value has a well-defined type with known properties.",
			],
		},
	},
	setup(context) {
		const reportedChains = new WeakSet<ts.Node>();

		function findRootAnyAccess(
			node: ts.ElementAccessExpression | ts.PropertyAccessExpression,
			typeChecker: ts.TypeChecker,
		): ts.ElementAccessExpression | ts.PropertyAccessExpression | undefined {
			const objectNode = node.expression;
			const objectType = getConstrainedTypeAtLocation(objectNode, typeChecker);

			if (!tsutils.isTypeFlagSet(objectType, ts.TypeFlags.Any)) {
				return undefined;
			}

			if (
				ts.isPropertyAccessExpression(objectNode) ||
				ts.isElementAccessExpression(objectNode)
			) {
				const deeper = findRootAnyAccess(objectNode, typeChecker);
				if (deeper) {
					return deeper;
				}
			}

			return node;
		}

		function markChainAsReported(
			node: ts.ElementAccessExpression | ts.PropertyAccessExpression,
		) {
			reportedChains.add(node);
			const objectNode = node.expression;
			if (
				ts.isPropertyAccessExpression(objectNode) ||
				ts.isElementAccessExpression(objectNode)
			) {
				markChainAsReported(objectNode);
			}
		}

		function checkMemberExpression(
			node: ts.ElementAccessExpression | ts.PropertyAccessExpression,
			sourceFile: ts.SourceFile,
			typeChecker: ts.TypeChecker,
		) {
			if (reportedChains.has(node)) {
				return;
			}

			const rootAccess = findRootAnyAccess(node, typeChecker);
			if (!rootAccess) {
				return;
			}

			markChainAsReported(node);

			const objectType = getConstrainedTypeAtLocation(
				rootAccess.expression,
				typeChecker,
			);
			const reportNode = ts.isPropertyAccessExpression(rootAccess)
				? rootAccess.name
				: rootAccess.argumentExpression;

			context.report({
				data: {
					type: tsutils.isIntrinsicErrorType(objectType) ? "`error`" : "`any`",
				},
				message: "unsafeMemberAccess",
				range: getTSNodeRange(reportNode, sourceFile),
			});
		}

		function checkComputedKey(
			node: ts.ElementAccessExpression,
			sourceFile: ts.SourceFile,
			typeChecker: ts.TypeChecker,
		) {
			const keyNode = node.argumentExpression;

			if (
				ts.isStringLiteral(keyNode) ||
				ts.isNumericLiteral(keyNode) ||
				ts.isNoSubstitutionTemplateLiteral(keyNode)
			) {
				return;
			}

			const keyType = getConstrainedTypeAtLocation(keyNode, typeChecker);

			if (tsutils.isTypeFlagSet(keyType, ts.TypeFlags.Any)) {
				context.report({
					data: {
						type: tsutils.isIntrinsicErrorType(keyType) ? "`error`" : "`any`",
					},
					message: "unsafeComputedMemberAccess",
					range: getTSNodeRange(keyNode, sourceFile),
				});
			}
		}

		return {
			visitors: {
				ElementAccessExpression: (node, { sourceFile, typeChecker }) => {
					checkMemberExpression(node, sourceFile, typeChecker);
					checkComputedKey(node, sourceFile, typeChecker);
				},
				PropertyAccessExpression: (node, { sourceFile, typeChecker }) => {
					checkMemberExpression(node, sourceFile, typeChecker);
				},
			},
		};
	},
});
