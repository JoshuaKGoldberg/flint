import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports recursive access to `this` within getters and setters, which causes infinite recursion.",
		id: "accessorThisRecursion",
		preset: "logical",
	},
	messages: {
		getterRecursion: {
			primary:
				"Getting `this` property within its own getter causes infinite recursion.",
			secondary: [
				"When a getter accesses itself via `this.propertyName`, it will infinitely recurse and cause a stack overflow.",
			],
			suggestions: [
				"Use a different backing property name such as an underscore-prefixed field.",
			],
		},
		setterRecursion: {
			primary:
				"Setting `this` property within its own setter causes infinite recursion.",
			secondary: [
				"When a setter assigns to itself via `this.propertyName`, it will infinitely recurse and cause a stack overflow.",
			],
			suggestions: [
				"Use a different backing property name such as an underscore-prefixed field.",
			],
		},
	},
	setup(context) {
		function getAccessorName(
			accessor: ts.GetAccessorDeclaration | ts.SetAccessorDeclaration,
		) {
			if (ts.isIdentifier(accessor.name)) {
				return accessor.name.text;
			}

			if (ts.isStringLiteral(accessor.name)) {
				return accessor.name.text;
			}

			return undefined;
		}

		function checkPropertyAccess(
			node: ts.PropertyAccessExpression,
			accessorName: string,
			sourceFile: ts.SourceFile,
			messageKey: "getterRecursion" | "setterRecursion",
		) {
			if (
				node.expression.kind === ts.SyntaxKind.ThisKeyword &&
				ts.isIdentifier(node.name) &&
				node.name.text === accessorName
			) {
				context.report({
					message: messageKey,
					range: getTSNodeRange(node, sourceFile),
				});
			}
		}

		function visitDescendantsForPropertyAccess(
			node: ts.Node,
			accessorName: string,
			sourceFile: ts.SourceFile,
			isGetter: boolean,
		) {
			const visit = (child: ts.Node) => {
				if (ts.isPropertyAccessExpression(child)) {
					if (isGetter) {
						checkPropertyAccess(
							child,
							accessorName,
							sourceFile,
							"getterRecursion",
						);
					} else if (
						ts.isBinaryExpression(child.parent) &&
						child.parent.left === child &&
						child.parent.operatorToken.kind === ts.SyntaxKind.EqualsToken
					) {
						checkPropertyAccess(
							child,
							accessorName,
							sourceFile,
							"setterRecursion",
						);
					}
				}

				ts.forEachChild(child, visit);
			};

			ts.forEachChild(node, visit);
		}

		return {
			visitors: {
				GetAccessor: (node, { sourceFile }) => {
					const accessorName = getAccessorName(node);
					if (!accessorName || !node.body) {
						return;
					}

					visitDescendantsForPropertyAccess(
						node.body,
						accessorName,
						sourceFile,
						true,
					);
				},
				SetAccessor: (node, { sourceFile }) => {
					const accessorName = getAccessorName(node);
					if (!accessorName || !node.body) {
						return;
					}

					visitDescendantsForPropertyAccess(
						node.body,
						accessorName,
						sourceFile,
						false,
					);
				},
			},
		};
	},
});
