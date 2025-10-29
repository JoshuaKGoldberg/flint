import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallow computed member access on imported namespace identifiers.",
		id: "importedNamespaceDynamicAccesses",
	},
	messages: {
		noDynamicAccess: {
			primary:
				"Avoid computed member access on namespace imports as it prevents tree-shaking optimizations.",
			secondary: [
				"Dynamic property access on namespace imports prevents bundlers from determining which exports are used.",
				"This results in the entire module being included in the bundle instead of just the parts you use.",
			],
			suggestions: [
				"Use static property access (e.g., `namespace.property`) instead of computed access (e.g., `namespace[property]`).",
				"If you need dynamic access, import individual exports instead of using a namespace import.",
			],
		},
	},
	setup(context) {
		function isNamespaceImportDeclaration(declaration: ts.Declaration) {
			return (
				ts.isNamespaceImport(declaration) &&
				ts.isImportClause(declaration.parent) &&
				ts.isImportDeclaration(declaration.parent.parent)
			);
		}

		function isIdentifierNamespaceImport(identifier: ts.Identifier) {
			return context.typeChecker
				.getSymbolAtLocation(identifier)
				?.getDeclarations()
				?.some(isNamespaceImportDeclaration);
		}

		return {
			visitors: {
				ElementAccessExpression(node: ts.ElementAccessExpression) {
					if (
						ts.isIdentifier(node.expression) &&
						isIdentifierNamespaceImport(node.expression)
					) {
						context.report({
							message: "noDynamicAccess",
							range: getTSNodeRange(node, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
