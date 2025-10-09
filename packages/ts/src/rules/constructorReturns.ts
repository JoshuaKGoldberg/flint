import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallows returning values from constructor functions in classes.",
		id: "constructorReturns",
		preset: "untyped",
	},
	messages: {
		noConstructorReturn: {
			primary:
				"Constructors should not return values other than `this` or `undefined`.",
			secondary: [
				"Returning a value from a constructor function can cause unexpected behavior.",
				"If a constructor returns a value, that value becomes the result of the `new` expression instead of the newly created instance.",
				"This can lead to confusion and bugs because callers expect `new` to return an instance of the class.",
			],
			suggestions: [
				"Remove the return statement or return only `this` or `undefined`.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				ReturnStatement: (node) => {
					if (!node.expression) {
						return;
					}

					let current: ts.Node | undefined = node.parent;
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					while (current !== undefined) {
						if (
							ts.isConstructorDeclaration(current) ||
							ts.isConstructSignatureDeclaration(current)
						) {
							context.report({
								message: "noConstructorReturn",
								range: {
									begin: node.getStart(context.sourceFile),
									end: node.getStart(context.sourceFile) + "return".length,
								},
							});
							return;
						}

						if (ts.isFunctionLike(current)) {
							return;
						}

						current = current.parent;
					}
				},
			},
		};
	},
});
