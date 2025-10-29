import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";
import { z } from "zod";

function isParameterReferenced(
	parameterName: string,
	functionBody: ts.Node | undefined,
): boolean {
	if (!functionBody) {
		return false;
	}

	let isReferenced = false;

	function visit(node: ts.Node) {
		if (ts.isIdentifier(node) && node.text === parameterName) {
			const parent = node.parent;
			if (!ts.isParameter(parent) || parent.name !== node) {
				isReferenced = true;
			}
		}

		if (!isReferenced) {
			ts.forEachChild(node, visit);
		}
	}

	visit(functionBody);
	return isReferenced;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Require error handling in callback functions by checking that error parameters are used.",
		id: "callbackErrorHandling",
		preset: "logical",
	},
	messages: {
		expectedErrorHandling: {
			primary:
				"This error is not handled in the callback, which may indicate missing error handling logic.",
			secondary: [
				"Callback functions should handle error parameters to prevent silent failures.",
				"If the error is intentionally ignored, consider explicitly handling it or renaming the parameter to indicate it's unused (e.g., `_err`).",
			],
			suggestions: [
				"Add error handling logic (e.g., throw the error, log it, or pass it to another callback)",
				"Rename the parameter to indicate it's intentionally unused (e.g., `_err`)",
			],
		},
	},
	options: {
		errorArgument: z
			.string()
			.default("^err|error$")
			.describe(
				"Regular expression contents to check for error parameter names.",
			),
	},
	setup(context, options) {
		// TODO: apply defaults from the Zod schemas
		const errorMatcher = new RegExp(options.errorArgument ?? "^err|error$");

		function checkFunction(
			node: ts.ArrowFunction | ts.FunctionDeclaration | ts.FunctionExpression,
		) {
			const firstParameterName =
				node.parameters.length &&
				ts.isIdentifier(node.parameters[0].name) &&
				node.parameters[0].name.text;

			if (
				firstParameterName &&
				errorMatcher.test(firstParameterName) &&
				!isParameterReferenced(firstParameterName, node.body)
			) {
				context.report({
					message: "expectedErrorHandling",
					range: getTSNodeRange(node.parameters[0], context.sourceFile),
				});
			}
		}

		return {
			visitors: {
				ArrowFunction: checkFunction,
				FunctionDeclaration: checkFunction,
				FunctionExpression: checkFunction,
			},
		};
	},
});
