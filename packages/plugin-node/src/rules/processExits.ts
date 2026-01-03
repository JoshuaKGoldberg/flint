import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

import { isDeclaredInNodeTypes } from "./utils/isDeclaredInNodeTypes.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prevent direct use of `process.exit()` for better error handling and testing.",
		id: "processExits",
		preset: "logical",
	},
	messages: {
		noProcessExit: {
			primary:
				"Prefer throwing errors or returning exit codes over terminating with `process.exit()` directly.",
			secondary: [
				"Calling `process.exit()` immediately terminates the Node.js process, preventing proper cleanup and making code harder to test.",
				"Throwing errors allows proper error handling and stack traces.",
				"For CLI applications, return exit codes from the main function instead.",
			],
			suggestions: [
				"Throw an error to signal failure with proper error handling",
				"Return an exit code from the main function for CLI applications",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression(node, { sourceFile, typeChecker }) {
					if (
						ts.isPropertyAccessExpression(node.expression) &&
						ts.isIdentifier(node.expression.expression) &&
						node.expression.expression.text === "process" &&
						ts.isIdentifier(node.expression.name) &&
						node.expression.name.text === "exit" &&
						isDeclaredInNodeTypes(node.expression, typeChecker)
					) {
						context.report({
							message: "noProcessExit",
							range: getTSNodeRange(node.expression, sourceFile),
						});
					}
				},
			},
		};
	},
});
