import { runtimeBase } from "@flint.fyi/core";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports using the void operator.",
		id: "voidOperator",
		preset: "stylistic",
	},
	messages: {
		noVoid: {
			primary:
				"Prefer an explicit value over using the void operator to produce undefined.",
			secondary: [
				"The void operator evaluates an expression and returns undefined, regardless of the expression's value.",
				"This is often confusing and can be replaced with more explicit code.",
				"Instead of using void, return or assign undefined directly.",
			],
			suggestions: [
				"Replace void expressions with undefined or restructure the code to be more explicit.",
			],
		},
	},
	setup() {
		return {
			...runtimeBase,
			visitors: {
				VoidExpression: (node, context) => {
					context.report({
						message: "noVoid",
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
