import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallow declarations in the global scope that implicitly create properties on the global object.",
		id: "implicitGlobals",
		preset: "logical",
	},
	messages: {
		globalDeclaration: {
			primary:
				"Avoid creating implicit global {{ declarationType }} `{{ name }}` that pollutes the global scope.",
			secondary: [
				"In browser scripts (non-modules), top-level var declarations and function declarations create properties on the global object (window).",
				"This can lead to naming conflicts and makes code harder to maintain.",
				"Use modules, const/let declarations, or explicitly namespace your code instead.",
			],
			suggestions: [
				"Convert to a module by adding an export statement",
				"Use const or let instead of var",
				"Wrap code in an IIFE or use explicit namespacing",
			],
		},
	},
	setup(context) {
		const sourceFile = context.sourceFile;

		// Only check script files, not modules
		if (ts.isExternalModule(sourceFile)) {
			return {};
		}

		return {
			visitors: {
				FunctionDeclaration(node: ts.FunctionDeclaration) {
					// Only flag top-level function declarations
					if (node.parent !== sourceFile) {
						return;
					}

					// Skip ambient declarations
					if (
						node.modifiers?.some(
							(mod) => mod.kind === ts.SyntaxKind.DeclareKeyword,
						)
					) {
						return;
					}

					if (node.name === undefined) {
						return;
					}

					const name = node.name.text;

					context.report({
						data: { declarationType: "function", name },
						message: "globalDeclaration",
						range: getTSNodeRange(node.name, context.sourceFile),
					});
				},
				VariableStatement(node: ts.VariableStatement) {
					// Only check top-level variable statements
					if (node.parent !== sourceFile) {
						return;
					}

					// Skip ambient declarations
					if (
						node.modifiers?.some(
							(mod) => mod.kind === ts.SyntaxKind.DeclareKeyword,
						)
					) {
						return;
					}

					// Only flag var declarations (const/let don't create global properties)
					const declaration = node.declarationList;
					if (
						(declaration.flags & (ts.NodeFlags.Let | ts.NodeFlags.Const)) ===
						0
					) {
						for (const varDeclaration of declaration.declarations) {
							if (ts.isIdentifier(varDeclaration.name)) {
								context.report({
									data: {
										declarationType: "variable",
										name: varDeclaration.name.text,
									},
									message: "globalDeclaration",
									range: getTSNodeRange(
										varDeclaration.name,
										context.sourceFile,
									),
								});
							} else {
								// For destructuring, report the whole pattern
								context.report({
									data: {
										declarationType: "variable",
										name: varDeclaration.name.getText(sourceFile),
									},
									message: "globalDeclaration",
									range: getTSNodeRange(
										varDeclaration.name,
										context.sourceFile,
									),
								});
							}
						}
					}
				},
			},
		};
	},
});
