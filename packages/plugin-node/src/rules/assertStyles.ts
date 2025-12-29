import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

function isAssertImport(importName: string) {
	return (
		importName === "assert" ||
		importName === "assert/strict" ||
		importName === "node:assert" ||
		importName === "node:assert/strict"
	);
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer `assert.ok()` over `assert()` for explicit intent and better readability.",
		id: "assertStyles",
		preset: "stylistic",
	},
	messages: {
		preferAssertOk: {
			primary:
				"Prefer `assert.ok()` over `assert()` for explicit intent and better readability.",
			secondary: [
				"Using `assert.ok()` aligns with other assert methods, ensuring consistency and making code easier to maintain and understand.",
				"The explicit method call clarifies the assertion's purpose.",
			],
			suggestions: [
				"Use `assert.ok()` instead of calling `assert()` directly.",
			],
		},
	},
	setup(context) {
		const assertIdentifierNames = new Set<string>();

		return {
			visitors: {
				CallExpression(node: ts.CallExpression, { sourceFile }) {
					if (
						ts.isIdentifier(node.expression) &&
						assertIdentifierNames.has(node.expression.text)
					) {
						context.report({
							message: "preferAssertOk",
							range: getTSNodeRange(node.expression, sourceFile),
						});
					}
				},
				ImportDeclaration(node: ts.ImportDeclaration) {
					if (
						!ts.isStringLiteral(node.moduleSpecifier) ||
						!isAssertImport(node.moduleSpecifier.text) ||
						!node.importClause
					) {
						return;
					}

					if (node.importClause.name) {
						assertIdentifierNames.add(node.importClause.name.text);
					}

					if (node.importClause.namedBindings) {
						if (ts.isNamedImports(node.importClause.namedBindings)) {
							for (const element of node.importClause.namedBindings.elements) {
								const importedName =
									element.propertyName?.text ?? element.name.text;
								if (importedName === "strict") {
									assertIdentifierNames.add(element.name.text);
								}
							}
						} else if (ts.isNamespaceImport(node.importClause.namedBindings)) {
							assertIdentifierNames.add(
								node.importClause.namedBindings.name.text,
							);
						}
					}
				},
				ImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
					if (
						ts.isExternalModuleReference(node.moduleReference) &&
						ts.isStringLiteral(node.moduleReference.expression) &&
						isAssertImport(node.moduleReference.expression.text)
					) {
						assertIdentifierNames.add(node.name.text);
					}
				},
			},
		};
	},
});
