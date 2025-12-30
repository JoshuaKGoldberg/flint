import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports using variables that are not defined.",
		id: "undefinedVariables",
		preset: "untyped",
	},
	messages: {
		undefinedVariable: {
			primary: "Variable '{{ name }}' is used but was never defined.",
			secondary: [
				"Variables must be declared before they can be used.",
				"Using undefined variables will cause a ReferenceError at runtime.",
			],
			suggestions: [
				"Declare the variable before using it, or check if the variable name is spelled correctly.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				Identifier: (node, { sourceFile, typeChecker }) => {
					if (
						ts.isVariableDeclaration(node.parent) &&
						node.parent.name === node
					) {
						return;
					}

					if (ts.isParameter(node.parent) && node.parent.name === node) {
						return;
					}

					if (
						(ts.isFunctionDeclaration(node.parent) ||
							ts.isClassDeclaration(node.parent) ||
							ts.isInterfaceDeclaration(node.parent) ||
							ts.isTypeAliasDeclaration(node.parent) ||
							ts.isEnumDeclaration(node.parent) ||
							ts.isModuleDeclaration(node.parent)) &&
						node.parent.name === node
					) {
						return;
					}

					if (
						ts.isImportSpecifier(node.parent) ||
						ts.isImportClause(node.parent) ||
						ts.isNamespaceImport(node.parent)
					) {
						return;
					}

					if (
						ts.isPropertyAccessExpression(node.parent) &&
						node.parent.name === node
					) {
						return;
					}

					if (
						ts.isPropertyAssignment(node.parent) &&
						node.parent.name === node
					) {
						return;
					}

					if (
						ts.isTypeOfExpression(node.parent) &&
						node.parent.expression === node
					) {
						return;
					}

					// TODO: This rule is untyped, so it should use scope analysis
					// https://github.com/JoshuaKGoldberg/flint/issues/400
					if (!typeChecker.getSymbolAtLocation(node)) {
						context.report({
							data: {
								name: node.text,
							},
							message: "undefinedVariable",
							range: {
								begin: node.getStart(sourceFile),
								end: node.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
