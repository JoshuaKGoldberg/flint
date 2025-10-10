import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using the Function constructor to create functions from strings.",
		id: "functionNewCalls",
		preset: "logical",
	},
	messages: {
		noFunctionConstructor: {
			primary:
				"Prefer function declarations or arrow functions over the Function constructor.",
			secondary: [
				"Using the `Function` constructor to create functions from strings is similar to `eval()` and introduces security risks and performance issues.",
				"Code passed to the Function constructor is executed in the global scope, making it harder to optimize and potentially allowing arbitrary code execution if user input is involved.",
			],
			suggestions: [
				"Define functions using function declarations (`function name() {}`) or arrow functions (`() => {}`) instead.",
				"If dynamic code generation is truly necessary, consider safer alternatives like passing functions as parameters or using a more constrained domain-specific approach.",
			],
		},
	},
	setup(context) {
		function isFunctionConstructor(
			node: ts.NewExpression | ts.CallExpression,
		): boolean {
			const expression = node.expression;

			// Check for direct `Function` identifier
			if (ts.isIdentifier(expression) && expression.text === "Function") {
				return true;
			}

			// Check for `globalThis.Function` or `window.Function`
			if (ts.isPropertyAccessExpression(expression)) {
				const propertyName = expression.name.text;
				if (propertyName !== "Function") {
					return false;
				}

				const object = expression.expression;
				if (ts.isIdentifier(object)) {
					return object.text === "globalThis" || object.text === "window";
				}
			}

			return false;
		}

		return {
			visitors: {
				CallExpression: (node) => {
					if (isFunctionConstructor(node)) {
						context.report({
							message: "noFunctionConstructor",
							range: getTSNodeRange(node.expression, context.sourceFile),
						});
					}
				},
				NewExpression: (node) => {
					if (isFunctionConstructor(node)) {
						context.report({
							message: "noFunctionConstructor",
							range: getTSNodeRange(node.expression, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
