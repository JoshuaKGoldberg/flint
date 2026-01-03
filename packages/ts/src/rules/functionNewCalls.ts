import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage, type TypeScriptServices } from "../language.js";
import { isGlobalDeclaration } from "../utils/isGlobalDeclaration.js";
import { isGlobalDeclarationOfName } from "../utils/isGlobalDeclarationOfName.js";

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
				"Dynamically creating functions with the Function constructor is insecure and slow.",
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
		function checkNode(
			node: ts.CallExpression | ts.NewExpression,
			{ sourceFile, typeChecker }: TypeScriptServices,
		) {
			if (isFunctionConstructor(node, typeChecker)) {
				context.report({
					message: "noFunctionConstructor",
					range: getTSNodeRange(node.expression, sourceFile),
				});
			}
		}

		function isFunctionConstructor(
			node: ts.CallExpression | ts.NewExpression,
			typeChecker: ts.TypeChecker,
		) {
			if (ts.isIdentifier(node.expression)) {
				if (
					isGlobalDeclarationOfName(node.expression, "Function", typeChecker)
				) {
					return true;
				}
			} else if (
				ts.isPropertyAccessExpression(node.expression) &&
				isGlobalDeclaration(node.expression, typeChecker)
			) {
				const propertyName = node.expression.name.text;
				if (propertyName !== "Function") {
					return false;
				}

				const object = node.expression.expression;
				if (ts.isIdentifier(object)) {
					return object.text === "globalThis" || object.text === "window";
				}
			}

			return false;
		}

		return {
			visitors: {
				CallExpression: checkNode,
				NewExpression: checkNode,
			},
		};
	},
});
