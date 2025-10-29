import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

function isImportFromNodeAssert(expression: ts.Expression) {
	return (
		ts.isStringLiteral(expression) &&
		(expression.text === "assert" || expression.text === "node:assert")
	);
}

function isStrictAssertImport(expression: ts.Expression) {
	return (
		ts.isStringLiteral(expression) &&
		(expression.text === "assert/strict" ||
			expression.text === "node:assert/strict")
	);
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer strict assertion mode from Node.js for better error messages and behavior.",
		id: "assertStrict",
		preset: "logical",
	},
	messages: {
		preferStrictAssert: {
			primary:
				"Prefer importing from `node:assert/strict` or using `{ strict as assert }` from `node:assert`.",
			secondary: [
				"In strict assertion mode, non-strict methods like `deepEqual()` behave like their strict counterparts (`deepStrictEqual()`).",
				"Strict mode provides better error messages with diffs and more reliable equality checks.",
			],
			suggestions: [
				"Import from `node:assert/strict` for strict assertion mode",
				"Use `import { strict as assert }` from `node:assert`",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				ImportDeclaration(node: ts.ImportDeclaration) {
					if (isStrictAssertImport(node.moduleSpecifier)) {
						return;
					}

					if (!isImportFromNodeAssert(node.moduleSpecifier)) {
						return;
					}

					if (node.importClause) {
						if (node.importClause.namedBindings) {
							if (ts.isNamedImports(node.importClause.namedBindings)) {
								for (const element of node.importClause.namedBindings
									.elements) {
									const importedName =
										element.propertyName?.text ?? element.name.text;
									if (importedName === "strict") {
										return;
									}
								}
							}
						}

						context.report({
							message: "preferStrictAssert",
							range: getTSNodeRange(node.moduleSpecifier, context.sourceFile),
						});
					}
				},
				ImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
					if (
						ts.isExternalModuleReference(node.moduleReference) &&
						isImportFromNodeAssert(node.moduleReference.expression)
					) {
						context.report({
							message: "preferStrictAssert",
							range: getTSNodeRange(
								node.moduleReference.expression,
								context.sourceFile,
							),
						});
					}
				},
			},
		};
	},
});
