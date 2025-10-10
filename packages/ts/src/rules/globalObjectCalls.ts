import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

const GLOBAL_OBJECTS = new Set(["Atomics", "JSON", "Math", "Reflect"]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports calling global objects like Math, JSON, Reflect, or Atomics as functions.",
		id: "globalObjectCalls",
		preset: "untyped",
	},
	messages: {
		noGlobalObjectCall: {
			primary:
				"{{ name }} is not a function and should not be called directly.",
			secondary: [
				"{{ name }} is a built-in global object that provides utility methods and properties.",
				"It is not a constructor or function and cannot be called or instantiated.",
			],
			suggestions: [
				"Use the static methods available on {{ name }} instead (e.g., {{ name }}.methodName()).",
			],
		},
	},
	setup(context) {
		function checkCallExpression(node: ts.CallExpression): void {
			if (
				ts.isIdentifier(node.expression) &&
				GLOBAL_OBJECTS.has(node.expression.text)
			) {
				context.report({
					data: {
						name: node.expression.text,
					},
					message: "noGlobalObjectCall",
					range: {
						begin: node.expression.getStart(context.sourceFile),
						end: node.expression.getEnd(),
					},
				});
			}
		}

		return {
			visitors: {
				CallExpression: (node) => {
					checkCallExpression(node);
				},
				NewExpression: (node) => {
					if (
						ts.isIdentifier(node.expression) &&
						GLOBAL_OBJECTS.has(node.expression.text)
					) {
						context.report({
							data: {
								name: node.expression.text,
							},
							message: "noGlobalObjectCall",
							range: {
								begin: node.expression.getStart(context.sourceFile),
								end: node.expression.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
