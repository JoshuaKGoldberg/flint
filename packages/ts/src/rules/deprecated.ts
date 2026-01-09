import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Disallow using code marked as @deprecated.",
		id: "deprecated",
		preset: "logical",
	},
	messages: {
		deprecated: {
			primary: "This is deprecated.",
			secondary: [
				"The @deprecated JSDoc tag indicates this code should no longer be used.",
				"Deprecated code may be removed in future versions.",
			],
			suggestions: ["Find a non-deprecated alternative."],
		},
	},
	setup(context) {
		function isDeprecated(symbol: ts.Symbol | undefined) {
			if (!symbol) {
				return false;
			}

			const declarations = symbol.getDeclarations();
			if (!declarations) {
				return false;
			}

			return declarations.some((declaration) => {
				const tags = ts.getJSDocTags(declaration);
				return tags.some(
					(tag) =>
						tag.tagName.text === "deprecated" ||
						tag.tagName.text === "Deprecated",
				);
			});
		}

		function checkNode(
			node: ts.Node,
			sourceFile: ts.SourceFile,
			typeChecker: ts.TypeChecker,
		) {
			const symbol = typeChecker.getSymbolAtLocation(node);
			if (isDeprecated(symbol)) {
				context.report({
					message: "deprecated",
					range: {
						begin: node.getStart(sourceFile),
						end: node.getEnd(),
					},
				});
			}
		}

		return {
			visitors: {
				Identifier: (node, { sourceFile, typeChecker }) => {
					if (
						ts.isPropertyAccessExpression(node.parent) &&
						node === node.parent.name
					) {
						checkNode(node, sourceFile, typeChecker);
						return;
					}

					if (ts.isQualifiedName(node.parent) && node === node.parent.right) {
						checkNode(node, sourceFile, typeChecker);
						return;
					}

					if (ts.isImportSpecifier(node.parent)) {
						return;
					}

					if (
						ts.isPropertyAssignment(node.parent) &&
						node === node.parent.name
					) {
						return;
					}

					if (
						ts.isPropertyDeclaration(node.parent) &&
						node === node.parent.name
					) {
						return;
					}

					if (
						ts.isMethodDeclaration(node.parent) &&
						node === node.parent.name
					) {
						return;
					}

					if (
						ts.isFunctionDeclaration(node.parent) &&
						node === node.parent.name
					) {
						return;
					}

					if (
						ts.isVariableDeclaration(node.parent) &&
						node === node.parent.name
					) {
						return;
					}

					if (ts.isClassDeclaration(node.parent) && node === node.parent.name) {
						return;
					}

					if (
						ts.isInterfaceDeclaration(node.parent) &&
						node === node.parent.name
					) {
						return;
					}

					if (
						ts.isTypeAliasDeclaration(node.parent) &&
						node === node.parent.name
					) {
						return;
					}

					if (ts.isEnumDeclaration(node.parent) && node === node.parent.name) {
						return;
					}

					if (ts.isEnumMember(node.parent) && node === node.parent.name) {
						return;
					}

					if (ts.isParameter(node.parent) && node === node.parent.name) {
						return;
					}

					checkNode(node, sourceFile, typeChecker);
				},
			},
		};
	},
});
