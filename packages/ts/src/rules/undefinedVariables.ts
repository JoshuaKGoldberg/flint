import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports using variables that are not defined.",
		id: "undefinedVariables",
		preset: "untyped",
	},
	messages: {
		undefinedVariable: {
			primary: "Using undefined variable '{{ name }}'.",
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
				Identifier: (node) => {
					// Skip if this identifier is the name of a declaration
					if (
						ts.isVariableDeclaration(node.parent) &&
						node.parent.name === node
					) {
						return;
					}

					// Skip if this is a parameter name
					if (ts.isParameter(node.parent) && node.parent.name === node) {
						return;
					}

					// Skip if this is a function/class/etc name
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

					// Skip import-related identifiers
					if (
						ts.isImportSpecifier(node.parent) ||
						ts.isImportClause(node.parent) ||
						ts.isNamespaceImport(node.parent)
					) {
						return;
					}

					// Skip if this is a property name
					if (
						ts.isPropertyAccessExpression(node.parent) &&
						node.parent.name === node
					) {
						return;
					}

					// Skip if this is a property assignment name
					if (
						ts.isPropertyAssignment(node.parent) &&
						node.parent.name === node
					) {
						return;
					}

					// Skip if this is a shorthand property assignment
					if (ts.isShorthandPropertyAssignment(node.parent)) {
						// For shorthand properties, we need to check if the value is defined
						// This is the identifier being referenced
					}

					// Skip if this is in a typeof expression (typeof is safe with undefined vars)
					if (
						ts.isTypeOfExpression(node.parent) &&
						node.parent.expression === node
					) {
						return;
					}

					// Try to get the symbol for this identifier
					const symbol = context.typeChecker.getSymbolAtLocation(node);

					// If there's no symbol, it means the variable is not defined
					if (!symbol) {
						context.report({
							data: {
								name: node.text,
							},
							message: "undefinedVariable",
							range: {
								begin: node.getStart(context.sourceFile),
								end: node.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
