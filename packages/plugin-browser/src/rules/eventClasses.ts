import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

function isImportFromNodeEvents(expression: ts.Expression) {
	return (
		ts.isStringLiteral(expression) &&
		(expression.text === "events" || expression.text === "node:events")
	);
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer EventTarget over EventEmitter for cross-platform compatibility.",
		id: "eventClasses",
		preset: "logical",
	},
	messages: {
		preferEventTarget: {
			primary:
				"Prefer the cross-platform `EventTarget` over the Node.js-specific `EventEmitter`.",
			secondary: [
				"While EventEmitter is Node.js-specific, EventTarget is available in browsers, Deno, and modern Node.js.",
				"Using EventTarget makes code more portable and reduces bundle size in browser environments.",
			],
			suggestions: [
				"Replace EventEmitter with EventTarget for cross-platform event handling",
			],
		},
	},
	setup(context) {
		function isDeclarationEventEmitter(declaration: ts.Declaration) {
			if (ts.isImportSpecifier(declaration)) {
				const importedName =
					declaration.propertyName?.text ?? declaration.name.text;

				if (importedName !== "EventEmitter") {
					return false;
				}

				if (
					ts.isImportDeclaration(declaration.parent.parent.parent) &&
					isImportFromNodeEvents(
						declaration.parent.parent.parent.moduleSpecifier,
					)
				) {
					return true;
				}
			}

			if (ts.isImportEqualsDeclaration(declaration)) {
				if (
					declaration.name.text === "EventEmitter" &&
					ts.isExternalModuleReference(declaration.moduleReference) &&
					isImportFromNodeEvents(declaration.moduleReference.expression)
				) {
					return true;
				}
			}

			return false;
		}

		function isIdentifierEventEmitter(identifier: ts.Identifier) {
			return context.typeChecker
				.getSymbolAtLocation(identifier)
				?.getDeclarations()
				?.some(isDeclarationEventEmitter);
		}

		function checkExpression(expression: ts.Expression) {
			if (ts.isIdentifier(expression) && isIdentifierEventEmitter(expression)) {
				context.report({
					message: "preferEventTarget",
					range: getTSNodeRange(expression, context.sourceFile),
				});
			}
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
							checkExpression(type.expression);
						}
					}
				},
				NewExpression(node: ts.NewExpression) {
					checkExpression(node.expression);
				},
			},
		};
	},
});
