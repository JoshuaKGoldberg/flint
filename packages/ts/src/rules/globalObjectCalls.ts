import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

const GLOBAL_OBJECTS = new Set(["Atomics", "JSON", "Math", "Reflect"]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports calling global objects like Math, JSON, or Reflect as functions.",
		id: "globalObjectCalls",
		preset: "untyped",
	},
	messages: {
		noGlobalObjectCall: {
			primary: "{{ name }} is not a function and cannot be called directly.",
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

		function checkNode({ expression }: ts.CallExpression | ts.NewExpression) {
			if (ts.isIdentifier(expression) && GLOBAL_OBJECTS.has(expression.text)) {
				reportGlobalObjectCall(expression, expression.text);
			}
		}

		return {
			visitors: {
				CallExpression: checkNode,
				NewExpression: checkNode,
			},
		};
	},
});
