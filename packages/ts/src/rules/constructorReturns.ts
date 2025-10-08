import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports returning values from constructor functions.",
		id: "constructorReturns",
		preset: "untyped",
	},
	messages: {
		noConstructorReturn: {
			primary:
				"Returning a value from a constructor function overrides the newly created instance.",
			secondary: [
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

						if (
							ts.isClassDeclaration(node) ||
							ts.isClassExpression(node) ||
							ts.isConstructorDeclaration(node) ||
							ts.isFunctionLike(node)
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
