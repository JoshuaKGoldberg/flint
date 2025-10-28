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

		if (isModule) {
			return {
				visitors: {},
			};
		}

		function checkFunctionDeclaration(node: ts.FunctionDeclaration) {
			if (!node.name) {
				return;
			}

			context.report({
				data: { declarationType: "function declaration" },
				message: "implicitGlobal",
				range: getTSNodeRange(node.name, context.sourceFile),
			});
		}

		function checkVariableStatement(node: ts.VariableStatement) {
			if (
				node.modifiers?.some(
					(modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
				) ||
				node.declarationList.flags & ts.NodeFlags.BlockScoped
			) {
				return;
			}

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

		return {
			visitors: {
				SourceFile(node) {
					for (const statement of node.statements) {
						if (ts.isFunctionDeclaration(statement)) {
							checkFunctionDeclaration(statement);
						} else if (ts.isVariableStatement(statement)) {
							checkVariableStatement(statement);
						}
					}
				},
			},
		};
	},
});
