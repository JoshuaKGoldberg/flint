import * as tsutils from "ts-api-utils";
import ts, { SyntaxKind } from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";
import type * as AST from "../types/ast.ts";

function hasModifier(
	node: AST.MethodDeclaration,
	kind: ts.SyntaxKind,
): boolean {
	return node.modifiers?.some((modifier) => modifier.kind === kind) ?? false;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports class methods that don't use `this` and could be static.",
		id: "classMethodsThis",
		preset: "stylistic",
	},
	messages: {
		couldBeStatic: {
			primary: "Method does not use `this` and could be made static.",
			secondary: [
				"Static methods don't require an instance to be called and make it clear that the method doesn't depend on instance state.",
			],
			suggestions: ["Add the `static` keyword to this method."],
		},
	},
	setup(context) {
		return {
			visitors: {
				MethodDeclaration: (node, { sourceFile }) => {
					if (!node.body) {
						return;
					}

					if (hasModifier(node, SyntaxKind.StaticKeyword)) {
						return;
					}

					if (hasModifier(node, SyntaxKind.AbstractKeyword)) {
						return;
					}

					if (hasModifier(node, SyntaxKind.OverrideKeyword)) {
						return;
					}

					function usesThis(checkNode: ts.Node): boolean {
						if (checkNode.kind === SyntaxKind.ThisKeyword) {
							return true;
						}

						if (checkNode.kind === SyntaxKind.SuperKeyword) {
							return true;
						}

						if (
							tsutils.isFunctionScopeBoundary(checkNode) &&
							!ts.isArrowFunction(checkNode)
						) {
							return false;
						}

						return ts.forEachChild(checkNode, usesThis) ?? false;
					}

					if (usesThis(node.body)) {
						return;
					}

					context.report({
						message: "couldBeStatic",
						range: getTSNodeRange(node.name, sourceFile),
					});
				},
			},
		};
	},
});
