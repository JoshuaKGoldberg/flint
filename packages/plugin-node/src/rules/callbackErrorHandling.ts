import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";
import { z } from "zod";

function getFirstParameterName(
	parameters: ts.NodeArray<ts.ParameterDeclaration>,
): string | undefined {
	if (parameters.length === 0) {
		return undefined;
	}

	const firstParameter = parameters[0];

	if (ts.isIdentifier(firstParameter.name)) {
		return firstParameter.name.text;
	}

	return undefined;
}

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

function isPattern(errorArgument: string): boolean {
	return errorArgument.startsWith("^");
}

function matchesConfiguredErrorName(
	name: string,
	errorArgument: string,
): boolean {
	if (isPattern(errorArgument)) {
		const regexp = new RegExp(errorArgument, "u");
		return regexp.test(name);
	}
	return name === errorArgument;
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
			primary: "Expected error to be handled in callback function.",
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
			.default("err")
			.describe(
				"The name or pattern of the error parameter to check. Defaults to 'err'. Patterns starting with '^' are treated as regular expressions.",
			),
	},
	setup(context, options) {
		const errorArgument = options.errorArgument ?? "err";

		function checkFunction(
			node: ts.ArrowFunction | ts.FunctionDeclaration | ts.FunctionExpression,
		) {
			const firstParameterName = getFirstParameterName(node.parameters);

			if (
				!firstParameterName ||
				!matchesConfiguredErrorName(firstParameterName, errorArgument)
			) {
				return;
			}

			const functionBody = node.body;
			if (!isParameterReferenced(firstParameterName, functionBody)) {
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
