import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prevents implicit global variable declarations in browser scripts.",
		id: "implicitGlobals",
		preset: "logical",
	},
	messages: {
		implicitGlobal: {
			primary:
				"This {{ declarationType }} creates an implicit global variable in browser scripts.",
			secondary: [
				"In browser scripts (non-modules), top-level `var` declarations and function declarations create properties on the global window object.",
				"This can lead to unexpected behavior and naming conflicts.",
				"Use modules (with import/export) or explicit window property assignment instead.",
			],
			suggestions: [
				"Convert to a module with export/import",
				"Use let or const instead (they don't create globals)",
				"Explicitly assign to window if global access is needed",
			],
		},
	},
	setup(context) {
		// Check if this is a module (has any import/export statements)
		const isModule = context.sourceFile.statements.some(
			(statement) =>
				ts.isImportDeclaration(statement) ||
				ts.isExportDeclaration(statement) ||
				ts.isExportAssignment(statement) ||
				(ts.isVariableStatement(statement) &&
					(statement.modifiers?.some(
						(modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
					) ??
						false)) ||
				(ts.isFunctionDeclaration(statement) &&
					(statement.modifiers?.some(
						(modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
					) ??
						false)),
		);

		// If it's a module, don't report anything
		if (isModule) {
			return { visitors: {} };
		}

		return {
			visitors: {
				FunctionDeclaration(node: ts.FunctionDeclaration) {
					// Only report top-level function declarations
					if (
						node.parent !== context.sourceFile ||
						!node.name ||
						// Don't report if it has export modifier
						node.modifiers?.some(
							(modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
						)
					) {
						return;
					}

					context.report({
						data: { declarationType: "function declaration" },
						message: "implicitGlobal",
						range: getTSNodeRange(node.name, context.sourceFile),
					});
				},
				VariableStatement(node: ts.VariableStatement) {
					// Only report top-level var declarations
					if (
						node.parent !== context.sourceFile ||
						// Don't report if it has export modifier
						node.modifiers?.some(
							(modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
						)
					) {
						return;
					}

					// Only flag 'var' declarations, not 'let' or 'const'
					if (
						!(node.declarationList.flags & ts.NodeFlags.Let) &&
						!(node.declarationList.flags & ts.NodeFlags.Const)
					) {
						// Report each variable declaration
						for (const declaration of node.declarationList.declarations) {
							if (ts.isIdentifier(declaration.name)) {
								context.report({
									data: { declarationType: "var declaration" },
									message: "implicitGlobal",
									range: getTSNodeRange(declaration.name, context.sourceFile),
								});
							}
						}
					}
				},
			},
		};
	},
});
