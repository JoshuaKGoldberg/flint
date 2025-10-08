import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports returning values from constructor functions.",
		id: "constructorReturns",
		preset: "logical",
	},
	messages: {
		noConstructorReturn: {
			primary: "Constructor functions should not return values.",
			secondary: [
				"Returning a value from a constructor overrides the newly created instance.",
				"This behavior is often unintentional and can lead to unexpected results.",
				"If you need to return a different object, consider using a factory function instead.",
			],
			suggestions: [
				"Remove the return statement, or return without a value to exit early.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				ConstructorDeclaration: (node) => {
					if (!node.body) {
						return;
					}

					function checkForReturnStatements(node: ts.Node): void {
						if (ts.isReturnStatement(node)) {
							if (node.expression) {
								context.report({
									message: "noConstructorReturn",
									range: {
										begin: node.getStart(context.sourceFile),
										end: node.getEnd(),
									},
								});
							}
							return;
						}

						// Don't traverse into nested functions/classes/constructors
						if (
							ts.isFunctionDeclaration(node) ||
							ts.isFunctionExpression(node) ||
							ts.isArrowFunction(node) ||
							ts.isClassDeclaration(node) ||
							ts.isClassExpression(node) ||
							ts.isConstructorDeclaration(node)
						) {
							return;
						}

						ts.forEachChild(node, checkForReturnStatements);
					}

					ts.forEachChild(node.body, checkForReturnStatements);
				},
			},
		};
	},
});
