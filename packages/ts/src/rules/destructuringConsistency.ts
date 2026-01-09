import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";
import * as AST from "../types/ast.ts";
import type { Checker } from "../types/checker.ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Use destructured variables over properties for consistency.",
		id: "destructuringConsistency",
		preset: "stylistic",
	},
	messages: {
		useDestructured: {
			primary:
				"Use the destructured variable instead of accessing the property again.",
			secondary: [
				"After destructuring an object, access properties through the destructured variables.",
				"Mixing destructured variables with property access on the same object is inconsistent.",
			],
			suggestions: ["Use the destructured variable instead."],
		},
	},
	setup(context) {
		const destructuredObjects = new Map<
			ts.Symbol,
			{
				declarationEnd: number;
				destructuredProperties: Set<string>;
			}
		>();

		function collectDestructuredProperties(
			node: AST.VariableDeclaration,
			typeChecker: Checker,
		) {
			if (!node.initializer) {
				return;
			}

			if (!ts.isObjectBindingPattern(node.name)) {
				return;
			}

			if (!ts.isIdentifier(node.initializer)) {
				return;
			}

			const symbol = typeChecker.getSymbolAtLocation(node.initializer);
			if (!symbol) {
				return;
			}

			const properties = new Set<string>();
			for (const element of node.name.elements) {
				if (
					ts.isBindingElement(element) &&
					element.propertyName &&
					ts.isIdentifier(element.propertyName)
				) {
					properties.add(element.propertyName.text);
				} else if (
					ts.isBindingElement(element) &&
					!element.propertyName &&
					ts.isIdentifier(element.name)
				) {
					properties.add(element.name.text);
				}
			}

			if (properties.size > 0) {
				destructuredObjects.set(symbol, {
					declarationEnd: node.getEnd(),
					destructuredProperties: properties,
				});
			}
		}

		return {
			visitors: {
				PropertyAccessExpression: (node, { sourceFile, typeChecker }) => {
					if (!ts.isIdentifier(node.expression)) {
						return;
					}

					const objectSymbol = typeChecker.getSymbolAtLocation(node.expression);
					if (!objectSymbol) {
						return;
					}

					const destructured = destructuredObjects.get(objectSymbol);
					if (!destructured) {
						return;
					}

					if (node.getStart(sourceFile) < destructured.declarationEnd) {
						return;
					}

					const propertyName = node.name.text;
					if (!destructured.destructuredProperties.has(propertyName)) {
						return;
					}

					if (
						ts.isCallExpression(node.parent) &&
						node.parent.expression === node
					) {
						return;
					}

					context.report({
						message: "useDestructured",
						range: {
							begin: node.getStart(sourceFile),
							end: node.getEnd(),
						},
					});
				},
				VariableDeclaration: (node, { typeChecker }) => {
					collectDestructuredProperties(node, typeChecker);
				},
			},
		};
	},
});
