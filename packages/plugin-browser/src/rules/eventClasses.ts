import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer EventTarget over EventEmitter for cross-platform compatibility.",
		id: "eventClasses",
		preset: "logical",
	},
	messages: {
		preferEventTarget: {
			primary: "Prefer `EventTarget` over `EventEmitter`.",
			secondary: [
				"While EventEmitter is Node.js-specific, EventTarget is available in browsers, Deno, and modern Node.js.",
				"Using EventTarget makes code more portable and reduces bundle size in browser environments.",
			],
			suggestions: [
				"Replace EventEmitter with EventTarget",
				"Use EventTarget for cross-platform event handling",
			],
		},
	},
	setup(context) {
		function checkIdentifierIsEventEmitter(identifier: ts.Identifier) {
			const symbol = context.typeChecker.getSymbolAtLocation(identifier);
			if (!symbol) {
				return false;
			}

			const declarations = symbol.getDeclarations();
			if (!declarations) {
				return false;
			}

			for (const declaration of declarations) {
				if (ts.isImportSpecifier(declaration)) {
					const propertyName = declaration.propertyName;
					const name = declaration.name;

					const importedName = propertyName ? propertyName.text : name.text;
					if (importedName !== "EventEmitter") {
						continue;
					}

					const importDeclaration = declaration.parent.parent.parent;
					if (ts.isImportDeclaration(importDeclaration)) {
						const moduleSpecifier = importDeclaration.moduleSpecifier;
						if (
							ts.isStringLiteral(moduleSpecifier) &&
							(moduleSpecifier.text === "events" ||
								moduleSpecifier.text === "node:events")
						) {
							return true;
						}
					}
				}

				if (ts.isImportEqualsDeclaration(declaration)) {
					if (declaration.name.text !== "EventEmitter") {
						continue;
					}

					const moduleReference = declaration.moduleReference;
					if (ts.isExternalModuleReference(moduleReference)) {
						const expression = moduleReference.expression;
						if (
							expression &&
							ts.isStringLiteral(expression) &&
							(expression.text === "events" ||
								expression.text === "node:events")
						) {
							return true;
						}
					}
				}
			}

			return false;
		}

		return {
			visitors: {
				ClassDeclaration(node: ts.ClassDeclaration) {
					if (!node.heritageClauses) {
						return;
					}

					for (const heritageClause of node.heritageClauses) {
						if (heritageClause.token !== ts.SyntaxKind.ExtendsKeyword) {
							continue;
						}

						for (const type of heritageClause.types) {
							const expression = type.expression;
							if (
								ts.isIdentifier(expression) &&
								checkIdentifierIsEventEmitter(expression)
							) {
								context.report({
									message: "preferEventTarget",
									range: getTSNodeRange(expression, context.sourceFile),
								});
							}
						}
					}
				},
				NewExpression(node: ts.NewExpression) {
					const expression = node.expression;
					if (
						ts.isIdentifier(expression) &&
						checkIdentifierIsEventEmitter(expression)
					) {
						context.report({
							message: "preferEventTarget",
							range: getTSNodeRange(expression, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
