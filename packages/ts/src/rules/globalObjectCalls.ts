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
		function reportGlobalObjectCall(
			expression: ts.Expression,
			name: string,
		): void {
			context.report({
				data: {
					name,
				},
				message: "noGlobalObjectCall",
				range: {
					begin: expression.getStart(context.sourceFile),
					end: expression.getEnd(),
				},
			});
		}

		function checkExpression(expression: ts.Expression): void {
			if (ts.isIdentifier(expression) && GLOBAL_OBJECTS.has(expression.text)) {
				reportGlobalObjectCall(expression, expression.text);
			}
		}

		return {
			visitors: {
				CallExpression: (node) => {
					checkExpression(node.expression);
				},
				NewExpression: (node) => {
					checkExpression(node.expression);
				},
			},
		};
	},
});
