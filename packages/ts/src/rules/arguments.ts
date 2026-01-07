import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

function isNonArrowFunctionBoundary(node: ts.Node): "quit" | boolean {
	if (ts.isArrowFunction(node)) {
		return "quit";
	}
	return (
		ts.isFunctionDeclaration(node) ||
		ts.isFunctionExpression(node) ||
		ts.isMethodDeclaration(node) ||
		ts.isGetAccessorDeclaration(node) ||
		ts.isSetAccessorDeclaration(node) ||
		ts.isConstructorDeclaration(node)
	);
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using the arguments object instead of rest parameters.",
		id: "arguments",
		preset: "logical",
	},
	messages: {
		preferRestParameters: {
			primary: "Use rest parameters instead of the `arguments` object.",
			secondary: [
				"The `arguments` object is an array-like object that doesn't have Array methods like `map`, `filter`, or `forEach`.",
				"Rest parameters provide a real Array, making it easier to work with variadic functions.",
			],
			suggestions: [
				"Replace usage of `arguments` with a rest parameter like `...args`.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				Identifier: (node) => {
					if (node.text !== "arguments") {
						return;
					}

					const { parent } = node;

					if (
						(ts.isPropertyAccessExpression(parent) ||
							ts.isPropertyAssignment(parent) ||
							ts.isShorthandPropertyAssignment(parent) ||
							ts.isParameter(parent) ||
							ts.isVariableDeclaration(parent) ||
							ts.isPropertyDeclaration(parent) ||
							ts.isBindingElement(parent) ||
							ts.isPropertySignature(parent)) &&
						parent.name === node
					) {
						return;
					}

					if (!ts.findAncestor(node, isNonArrowFunctionBoundary)) {
						return;
					}

					const symbol = context.typeChecker.getSymbolAtLocation(node);

					if (symbol) {
						const declarations = symbol.getDeclarations();
						if (declarations && declarations.length > 0) {
							const isUserDefined = declarations.some(
								(declaration) =>
									ts.isParameter(declaration) ||
									ts.isVariableDeclaration(declaration) ||
									ts.isPropertyDeclaration(declaration) ||
									ts.isBindingElement(declaration),
							);

							if (isUserDefined) {
								return;
							}
						}
					}

					context.report({
						message: "preferRestParameters",
						range: {
							begin: node.getStart(context.sourceFile),
							end: node.getEnd(),
						},
					});
				},
			},
		};
	},
});
