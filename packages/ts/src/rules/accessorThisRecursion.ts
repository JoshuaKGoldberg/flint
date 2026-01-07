import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

function getPropertyName(
	accessor: ts.GetAccessorDeclaration | ts.SetAccessorDeclaration,
	sourceFile: ts.SourceFile,
) {
	if (ts.isIdentifier(accessor.name)) {
		return accessor.name.text;
	}
	if (ts.isStringLiteral(accessor.name)) {
		return accessor.name.text;
	}
	if (ts.isNumericLiteral(accessor.name)) {
		return accessor.name.text;
	}
	return accessor.name.getText(sourceFile);
}

export default typescriptLanguage.createRule({
	about: {
		description: "Reports recursive access to this within getters and setters.",
		id: "accessorThisRecursion",
		preset: "logical",
	},
	messages: {
		noGetterRecursion: {
			primary:
				"Getter recursively accesses its own property via `this`, causing infinite recursion.",
			secondary: [
				"Accessing `this.propertyName` inside a getter for `propertyName` triggers the getter again.",
				"This results in a stack overflow error at runtime.",
			],
			suggestions: [
				"Store the value in a private field and return that instead.",
				"Use a different backing property name.",
			],
		},
		noSetterRecursion: {
			primary:
				"Setter recursively assigns to its own property via `this`, causing infinite recursion.",
			secondary: [
				"Assigning to `this.propertyName` inside a setter for `propertyName` triggers the setter again.",
				"This results in a stack overflow error at runtime.",
			],
			suggestions: [
				"Store the value in a private field instead.",
				"Use a different backing property name.",
			],
		},
	},
	setup(context) {
		function checkAccessor(
			accessor: ts.GetAccessorDeclaration | ts.SetAccessorDeclaration,
			sourceFile: ts.SourceFile,
		) {
			if (!accessor.body) {
				return;
			}

			const propertyName = getPropertyName(accessor, sourceFile);
			const isGetter = ts.isGetAccessorDeclaration(accessor);

			function checkNode(node: ts.Node): void {
				if (tsutils.isFunctionScopeBoundary(node)) {
					return;
				}

				if (ts.isPropertyAccessExpression(node)) {
					const accessedName = node.name.text;
					if (
						accessedName === propertyName &&
						node.expression.kind === ts.SyntaxKind.ThisKeyword
					) {
						if (isGetter) {
							context.report({
								message: "noGetterRecursion",
								range: {
									begin: node.getStart(sourceFile),
									end: node.getEnd(),
								},
							});
						} else {
							const parent = node.parent;
							if (
								ts.isBinaryExpression(parent) &&
								parent.left === node &&
								parent.operatorToken.kind === ts.SyntaxKind.EqualsToken
							) {
								context.report({
									message: "noSetterRecursion",
									range: {
										begin: node.getStart(sourceFile),
										end: node.getEnd(),
									},
								});
							}
						}
					}
				}

				ts.forEachChild(node, checkNode);
			}

			ts.forEachChild(accessor.body, checkNode);
		}

		return {
			visitors: {
				GetAccessor: (node, { sourceFile }) => {
					checkAccessor(node, sourceFile);
				},
				SetAccessor: (node, { sourceFile }) => {
					checkAccessor(node, sourceFile);
				},
			},
		};
	},
});
